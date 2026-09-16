// AyanomiBancho Shared Frontend Scripts

async function handleLogout(e) {
    if (e) e.preventDefault();
    try {
        await fetch('/api/logout', { method: 'POST' });
    } catch (_) {}
    document.cookie = "ayanomi_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0";
    window.location.href = "/login";
}

// User Dropdown toggling
function toggleUserDropdown(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('userDropdownMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('userDropdownMenu');
    const avatarBtn = document.querySelector('.nav-avatar-btn');
    if (dropdown && dropdown.classList.contains('show')) {
        if (!dropdown.contains(event.target) && !avatarBtn?.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    }
});

// Quick Toggles (Lazer mode & Classic scoring)
function toggleLazerPref(checked) {
    localStorage.setItem('ayanomi_lazer_mode', checked ? 'true' : 'false');
    showNavQuickToast(checked ? 'Đã bật chế độ Lazer!' : 'Đã tắt chế độ Lazer.');
}

function toggleClassicScorePref(checked) {
    localStorage.setItem('ayanomi_classic_score', checked ? 'true' : 'false');
    showNavQuickToast(checked ? 'Đã bật hệ thống điểm cổ điển!' : 'Đã tắt hệ thống điểm cổ điển.');
}

// Modals / Quick Actions
function openTeamModal(event) {
    if (event) event.preventDefault();
    alert('Tính năng Tạo Đội (Clan / Team) đang được hoàn thiện và sẽ sớm khả dụng trong bản cập nhật kế tiếp!');
}

function openFriendsModal(event) {
    if (event) event.preventDefault();
    alert('Tính năng Bạn Bè: Bạn có thể xem danh sách bạn bè trực tiếp qua osu! client hoặc in-game chat.');
}

function openFollowingModal(event) {
    if (event) event.preventDefault();
    alert('Tính năng Danh Sách Theo Dõi: Đang đồng bộ hóa người chơi mà bạn đang theo dõi.');
}

function toggleNavChat(event) {
    if (event) event.preventDefault();
    alert('Hộp thoại trò chuyện: Kết nối kênh chat #osu trong game để giao lưu cùng mọi người!');
}

function toggleNavNotif(event) {
    if (event) event.preventDefault();
    alert('Thông báo: Hiện không có thông báo mới nào.');
}

function showNavQuickToast(msg) {
    let toast = document.getElementById('navQuickToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'navQuickToast';
        toast.className = 'profile-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// Initialize Preferences on load
document.addEventListener('DOMContentLoaded', () => {
    const lazerCheckbox = document.getElementById('prefLazerMode');
    if (lazerCheckbox) {
        lazerCheckbox.checked = localStorage.getItem('ayanomi_lazer_mode') === 'true';
    }
    const classicCheckbox = document.getElementById('prefClassicScore');
    if (classicCheckbox) {
        classicCheckbox.checked = localStorage.getItem('ayanomi_classic_score') === 'true';
    }
    const theme = localStorage.getItem('ayanomi_theme');
    if (theme) {
        document.body.dataset.theme = theme;
    }
});
