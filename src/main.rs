use ayanomi_frontend::config::Config;
use ayanomi_frontend::db::{badges::init_badges_db, chat::init_chat_db, init_db};
use ayanomi_frontend::server::build_web_router;
use ayanomi_frontend::state::AppState;
use std::net::SocketAddr;
use std::time::Duration;
use tokio::net::TcpListener;
use tracing::info;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info,ayanomi_frontend=debug")),
        )
        .init();

    info!("===========================================================");
    info!("                 Ayanomi Frontend Service                  ");
    info!("===========================================================");

    let config = Config::load("config.toml")?;
    let db_pool = init_db(&config.database.path).await?;
    ayanomi_frontend::db::users::migrate_legacy_hardware_identifiers(
        &db_pool,
        &config.server.secret_key,
    )
    .await?;
    ayanomi_frontend::db::users::migrate_legacy_md5_passwords(&db_pool).await?;
    let chat_pool = init_chat_db(&config.database.chat_path).await?;
    let badges_pool = init_badges_db(&config.database.badges_path).await?;
    let multi_pool = ayanomi_frontend::db::multi::init_multi_db(&config.database.multi_path).await?;
    let app_state = AppState::new(db_pool, chat_pool, badges_pool, multi_pool, config.clone());

    // Spawn Rate Limiter idle cleanup worker (every 5 mins)
    let rate_limiter_clone = app_state.rate_limiter.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(300));
        loop {
            interval.tick().await;
            rate_limiter_clone.prune_stale(Duration::from_secs(600));
        }
    });

    let app = build_web_router(app_state);
    let bind_addr = format!("{}:{}", config.server.host, config.server.web_port);
    let listener = TcpListener::bind(&bind_addr).await?;

    info!("Ayanomi Frontend listening on http://{}", bind_addr);
    info!("Web Dashboard available at:    http://localhost:{}", config.server.web_port);
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await?;

    Ok(())
}
