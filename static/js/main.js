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
        const isShown = menu.classList.contains('show') || menu.style.display === 'block';
        if (isShown) {
            menu.classList.remove('show');
            menu.style.display = 'none';
        } else {
            menu.classList.add('show');
            menu.style.display = 'block';
        }
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('userDropdownMenu');
    const avatarBtn = document.querySelector('.nav-avatar-btn');
    if (dropdown) {
        if (!dropdown.contains(event.target) && !avatarBtn?.contains(event.target)) {
            dropdown.classList.remove('show');
            dropdown.style.display = 'none';
        }
    }
});

// Modals / Quick Actions

function openFriendsModal(event) {
    if (event) event.preventDefault();
    alert('Friends Feature: You can view your friend list directly in the osu! client or in-game chat.');
}

function openFollowingModal(event) {
    if (event) event.preventDefault();
    alert('Following List: Synchronizing followed players.');
}

function toggleNavChat(event) {
    if (event) event.preventDefault();
    alert('Chat: Join the #osu channel in-game to chat with others!');
}

function toggleNavNotif(event) {
    if (event) event.preventDefault();
    alert('Notifications: No new notifications at this time.');
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
    const theme = localStorage.getItem('ayanomi_theme');
    if (theme) {
        document.body.dataset.theme = theme;
    }
});
