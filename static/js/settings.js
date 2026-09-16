function showSettingsToast(msg, isError = false) {
    const toast = document.getElementById('settingsToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)';
    toast.style.color = '#ffffff';
    toast.style.border = isError ? '1px solid #ef4444' : '1px solid #10b981';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function switchSettingsTab(tabId, btn) {
    document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.settings-tab-panel').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    if (tabId === 'profile') {
        document.getElementById('tabContentProfile')?.classList.add('active');
    } else if (tabId === 'security') {
        document.getElementById('tabContentSecurity')?.classList.add('active');
    } else if (tabId === 'appearance') {
        document.getElementById('tabContentAppearance')?.classList.add('active');
    }
}

// Avatar upload
async function handleSettingsAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showSettingsToast('Ảnh đại diện không được vượt quá 5MB!', true);
        return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    try {
        const resp = await fetch('/api/profile/avatar', {
            method: 'POST',
            body: formData
        });
        const res = await resp.json();
        if (res.success) {
            const timestamp = Date.now();
            const preview = document.getElementById('settingsAvatarPreview');
            if (preview) preview.src = preview.src.split('?')[0] + '?v=' + timestamp;
            document.querySelectorAll('.nav-avatar-img').forEach(img => {
                img.src = img.src.split('?')[0] + '?v=' + timestamp;
            });
            showSettingsToast(res.message || 'Cập nhật ảnh đại diện thành công!');
        } else {
            showSettingsToast(res.message || 'Lỗi khi cập nhật ảnh đại diện.', true);
        }
    } catch (_) {
        showSettingsToast('Lỗi mạng khi tải ảnh lên.', true);
    }
}

// Avatar reset
async function handleSettingsAvatarReset() {
    if (!confirm('Bạn có chắc muốn đặt lại ảnh đại diện về mặc định?')) return;
    try {
        const resp = await fetch('/api/profile/avatar/reset', { method: 'POST' });
        const res = await resp.json();
        if (res.success) {
            const timestamp = Date.now();
            const preview = document.getElementById('settingsAvatarPreview');
            if (preview) preview.src = preview.src.split('?')[0] + '?v=' + timestamp;
            document.querySelectorAll('.nav-avatar-img').forEach(img => {
                img.src = img.src.split('?')[0] + '?v=' + timestamp;
            });
            showSettingsToast(res.message || 'Đã đặt lại ảnh đại diện mặc định!');
        } else {
            showSettingsToast(res.message || 'Không thể đặt lại ảnh đại diện.', true);
        }
    } catch (_) {
        showSettingsToast('Lỗi mạng khi thực hiện thao tác.', true);
    }
}

// Banner upload
async function handleSettingsBannerUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
        showSettingsToast('Ảnh bìa không được vượt quá 10MB!', true);
        return;
    }
    const formData = new FormData();
    formData.append('banner', file);
    try {
        const resp = await fetch('/api/profile/banner', {
            method: 'POST',
            body: formData
        });
        const res = await resp.json();
        if (res.success) {
            const timestamp = Date.now();
            const bannerPreview = document.getElementById('settingsBannerPreview');
            if (bannerPreview) {
                bannerPreview.style.backgroundImage = `url('/banner/?v=${timestamp}')`;
            }
            showSettingsToast(res.message || 'Cập nhật ảnh bìa thành công!');
        } else {
            showSettingsToast(res.message || 'Lỗi khi tải ảnh bìa.', true);
        }
    } catch (_) {
        showSettingsToast('Lỗi mạng khi tải ảnh lên.', true);
    }
}

// Banner reset
async function handleSettingsBannerReset() {
    if (!confirm('Bạn có chắc muốn đặt lại ảnh bìa về mặc định?')) return;
    try {
        const resp = await fetch('/api/profile/banner/reset', { method: 'POST' });
        const res = await resp.json();
        if (res.success) {
            const timestamp = Date.now();
            const bannerPreview = document.getElementById('settingsBannerPreview');
            if (bannerPreview) {
                bannerPreview.style.backgroundImage = `url('/banner/0?v=${timestamp}')`;
            }
            showSettingsToast(res.message || 'Đã đặt lại ảnh bìa mặc định!');
        } else {
            showSettingsToast(res.message || 'Không thể đặt lại ảnh bìa.', true);
        }
    } catch (_) {
        showSettingsToast('Lỗi mạng khi thực hiện thao tác.', true);
    }
}

function getSettingsFlagSvg(code, width = 28, height = 19) {
    const c = (code || 'VN').toUpperCase();
    if (c === 'VN') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="${width}" height="${height}" class="country-flag-svg" title="Vietnam" style="border-radius: 3px; display: inline-block; vertical-align: middle; box-shadow: 0 1px 3px rgba(0,0,0,0.35); flex-shrink: 0;"><rect width="900" height="600" fill="#da251d"/><polygon points="450,150 491.2,276.8 624.5,276.8 516.6,355.2 557.9,482 450,403.6 342.1,482 383.4,355.2 275.5,276.8 408.8,276.8" fill="#ffff00"/></svg>`;
    } else if (c === 'JP') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="${width}" height="${height}" class="country-flag-svg" title="Japan" style="border-radius: 3px; display: inline-block; vertical-align: middle; box-shadow: 0 1px 3px rgba(0,0,0,0.35); flex-shrink: 0;"><rect width="900" height="600" fill="#ffffff"/><circle cx="450" cy="300" r="180" fill="#bc002d"/></svg>`;
    } else {
        const lower = c.toLowerCase();
        return `<img src="https://flagcdn.com/${lower}.svg" width="${width}" height="${height}" class="country-flag-svg" alt="${c}" title="${c}" style="border-radius: 3px; display: inline-block; vertical-align: middle; object-fit: cover; box-shadow: 0 1px 3px rgba(0,0,0,0.35); flex-shrink: 0;" onerror="this.style.display='none'">`;
    }
}

// Country save & preview
function updateCountryFlagPreview(selectEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const code = (selectedOption?.dataset?.code || 'VN').toUpperCase();
    const flagBox = document.getElementById('settingsCurrentFlag');
    if (flagBox) {
        flagBox.innerHTML = getSettingsFlagSvg(code, 28, 19);
    }
}

async function saveSettingsCountry() {
    const select = document.getElementById('settingsCountrySelect');
    if (!select) return;
    const country = select.value;
    const selectedOption = select.options[select.selectedIndex];
    const code = (selectedOption?.dataset?.code || 'VN').toUpperCase();
    try {
        const resp = await fetch('/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: country })
        });
        const res = await resp.json();
        if (res.success) {
            document.querySelectorAll('.nav-flag-box').forEach(box => {
                box.innerHTML = getSettingsFlagSvg(code, 24, 16);
            });
            showSettingsToast('Đã lưu quốc gia thành công!');
        } else {
            showSettingsToast(res.message || 'Lỗi khi lưu quốc gia.', true);
        }
    } catch (_) {
        showSettingsToast('Lỗi kết nối khi cập nhật.', true);
    }
}

function quickClientMarkdown(raw) {
    if (!raw || !raw.trim()) {
        return '<i style="color: var(--text-muted);">Không có nội dung để hiển thị.</i>';
    }
    let html = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/^### (.*$)/gim, '<h3 style="margin-top:0.6rem; margin-bottom:0.4rem; color:var(--primary); font-size:1.15rem;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="margin-top:0.8rem; margin-bottom:0.5rem; font-size:1.3rem;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="margin-top:1rem; margin-bottom:0.6rem; font-size:1.5rem;">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left:3px solid var(--primary); margin:0.5rem 0; padding-left:0.8rem; color:var(--text-muted);">$1</blockquote>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3); padding:0.8rem; border-radius:6px; overflow-x:auto;"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3); padding:2px 5px; border-radius:4px;">$1</code>');
    html = html.replace(/!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:6px; margin:0.5rem 0;" />');
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--primary); text-decoration:underline;">$1</a>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

// Markdown Bio
function setSettingsBioTab(mode) {
    const tabWrite = document.getElementById('bioTabWrite');
    const tabPreview = document.getElementById('bioTabPreview');
    const writeArea = document.getElementById('settingsBioWriteArea');
    const previewArea = document.getElementById('settingsBioPreviewArea');
    const textarea = document.getElementById('settingsBioInput');

    if (mode === 'write') {
        if (tabWrite) tabWrite.classList.add('active');
        if (tabPreview) tabPreview.classList.remove('active');
        if (writeArea) writeArea.style.display = 'block';
        if (previewArea) previewArea.style.display = 'none';
    } else {
        if (tabPreview) tabPreview.classList.add('active');
        if (tabWrite) tabWrite.classList.remove('active');
        if (writeArea) writeArea.style.display = 'none';
        if (previewArea) {
            previewArea.style.display = 'block';
            const val = textarea ? textarea.value : '';

            // Instant client-side preview (0ms latency)
            previewArea.innerHTML = quickClientMarkdown(val);

            // Fetch high-fidelity server GFM & ammonia sanitized preview
            fetch('/api/profile/bio/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bio: val })
            })
            .then(r => {
                if (!r.ok) throw new Error('Status ' + r.status);
                return r.json();
            })
            .then(data => {
                if (data.success && data.rendered_html) {
                    previewArea.innerHTML = data.rendered_html;
                }
            })
            .catch(err => {
                console.warn('Using client-side bio preview:', err);
            });
        }
    }
}

function insertSettingsBio(prefix, suffix, placeholder) {
    const input = document.getElementById('settingsBioInput');
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    const selected = val.substring(start, end) || placeholder;
    input.value = val.substring(0, start) + prefix + selected + suffix + val.substring(end);
    input.focus();
    input.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
}

async function saveSettingsBio() {
    const textarea = document.getElementById('settingsBioInput');
    if (!textarea) return;
    const bio = textarea.value;
    try {
        const resp = await fetch('/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio: bio })
        });
        const res = await resp.json();
        if (res.success) {
            showSettingsToast('Đã lưu phần giới thiệu thành công!');
        } else {
            showSettingsToast(res.message || 'Không thể lưu giới thiệu.', true);
        }
    } catch (_) {
        showSettingsToast('Lỗi mạng khi lưu giới thiệu.', true);
    }
}

// Password Change
async function handleChangePassword(e) {
    e.preventDefault();
    const curPass = document.getElementById('currentPasswordInput')?.value || '';
    const newPass = document.getElementById('newPasswordInput')?.value || '';
    const confPass = document.getElementById('confirmPasswordInput')?.value || '';

    if (newPass.length < 6) {
        showSettingsToast('Mật khẩu mới phải có ít nhất 6 ký tự!', true);
        return;
    }
    if (newPass !== confPass) {
        showSettingsToast('Mật khẩu xác nhận không khớp!', true);
        return;
    }

    const btn = document.getElementById('btnSubmitPassword');
    if (btn) { btn.disabled = true; btn.innerText = 'Đang cập nhật...'; }

    try {
        const resp = await fetch('/api/settings/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_password: curPass,
                new_password: newPass,
                confirm_password: confPass
            })
        });
        const res = await resp.json();
        if (res.success) {
            showSettingsToast(res.message || 'Đổi mật khẩu thành công!');
            document.getElementById('changePasswordForm')?.reset();
        } else {
            showSettingsToast(res.message || 'Mật khẩu hiện tại không chính xác.', true);
        }
    } catch (_) {
        showSettingsToast('Lỗi kết nối khi đổi mật khẩu.', true);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = 'Cập Nhật Mật Khẩu'; }
    }
}

// Appearance Theme
function selectTheme(theme, el) {
    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    localStorage.setItem('ayanomi_theme', theme);
    document.body.dataset.theme = theme;
    showSettingsToast(`Đã áp dụng chủ đề: ${theme}`);
}

function toggleSoundPref(checked) {
    localStorage.setItem('ayanomi_sounds', checked ? 'true' : 'false');
    showSettingsToast(checked ? 'Đã bật âm thanh giao diện!' : 'Đã tắt âm thanh giao diện.');
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('settingsBioInput');
    const counter = document.getElementById('settingsBioCount');
    if (textarea && counter) {
        counter.textContent = textarea.value.length;
        textarea.addEventListener('input', () => {
            counter.textContent = textarea.value.length;
        });
    }

    const savedTheme = localStorage.getItem('ayanomi_theme') || 'dark';
    document.querySelectorAll('.theme-card').forEach(c => {
        if (c.getAttribute('onclick')?.includes(savedTheme)) c.classList.add('active');
        else c.classList.remove('active');
    });

    const soundBox = document.getElementById('prefSoundEffects');
    if (soundBox) {
        soundBox.checked = localStorage.getItem('ayanomi_sounds') !== 'false';
    }
});
