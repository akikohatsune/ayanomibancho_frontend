// AyanomiBancho Friends Management JS

function showFriendsToast(msg, isError = false) {
    let toast = document.getElementById('friendsToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'friendsToast';
        toast.className = 'profile-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'profile-toast show ' + (isError ? 'toast-error' : 'toast-success');
    clearTimeout(window.__friendsToastTimer);
    window.__friendsToastTimer = setTimeout(() => {
        toast.className = 'profile-toast';
    }, 3500);
}

function filterFriends(mode, btn) {
    document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.friend-card');
    cards.forEach(card => {
        if (mode === 'all') {
            card.style.display = 'flex';
        } else if (mode === 'mutual') {
            const isMutual = card.dataset.mutual === 'true';
            card.style.display = isMutual ? 'flex' : 'none';
        }
    });
}

async function handleAddFriend() {
    const input = document.getElementById('addFriendInput');
    if (!input) return;
    const query = input.value.trim();
    if (!query) {
        showFriendsToast("Please enter a username or User ID!", true);
        return;
    }

    try {
        const resp = await fetch('/api/friends/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
            showFriendsToast(data.message || "Friend added successfully!");
            input.value = "";
            setTimeout(() => { window.location.reload(); }, 900);
        } else {
            showFriendsToast(data.message || "Could not add friend.", true);
        }
    } catch (e) {
        showFriendsToast("Server connection error.", true);
    }
}

async function handleRemoveFriend(targetId, username) {
    if (!confirm(`Are you sure you want to remove ${username} from your friends?`)) return;

    try {
        const resp = await fetch('/api/friends/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_id: targetId })
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
            showFriendsToast(data.message || "Friend removed.");
            const card = document.getElementById(`friend-card-${targetId}`);
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => { card.remove(); }, 300);
            } else {
                setTimeout(() => { window.location.reload(); }, 800);
            }
        } else {
            showFriendsToast(data.message || "Error removing friend.", true);
        }
    } catch (e) {
        showFriendsToast("Connection error while removing friend.", true);
    }
}

async function toggleProfileFriend(targetId) {
    const btn = document.getElementById('btnProfileFriend');
    if (!btn) return;
    const isCurrentlyFriend = btn.dataset.isFriend === 'true';

    const url = isCurrentlyFriend ? '/api/friends/remove' : '/api/friends/add';
    const body = isCurrentlyFriend ? { target_id: targetId } : { query: targetId.toString() };

    btn.disabled = true;
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
            showFriendsToast(data.message || "Friend status updated!");
            if (isCurrentlyFriend) {
                btn.dataset.isFriend = 'false';
                btn.className = 'btn-friend-add';
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> <span>+ Add Friend</span>`;
            } else {
                btn.dataset.isFriend = 'true';
                btn.className = 'btn-friend-active';
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> <span>✓ Friend</span>`;
            }
        } else {
            showFriendsToast(data.message || "Failed to update friend status.", true);
        }
    } catch (_) {
        showFriendsToast("Connection error while sending request.", true);
    } finally {
        btn.disabled = false;
    }
}
