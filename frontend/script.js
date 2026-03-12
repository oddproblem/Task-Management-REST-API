const API = 'http://localhost:8080';
let token = localStorage.getItem('token');
let userEmail = localStorage.getItem('userEmail');

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    if (token && userEmail) {
        showDashboard();
    }
});

// ========== AUTH ==========
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('auth-error').classList.add('hidden');

    if (tab === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    btn.textContent = 'Signing in...';

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-password').value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }

        token = data.token;
        userEmail = data.email;
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', userEmail);
        showDashboard();
        showToast('Welcome back!', 'success');
    } catch (err) {
        showAuthError(err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('reg-btn');
    btn.disabled = true;
    btn.textContent = 'Creating account...';

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('reg-username').value,
                email: document.getElementById('reg-email').value,
                password: document.getElementById('reg-password').value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        token = data.token;
        userEmail = data.email;
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', userEmail);
        showDashboard();
        showToast('Account created!', 'success');
    } catch (err) {
        showAuthError(err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

function handleLogout() {
    token = null;
    userEmail = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    document.getElementById('dashboard-screen').classList.remove('active');
    document.getElementById('auth-screen').classList.add('active');
    document.getElementById('login-form').reset();
    showToast('Logged out', 'success');
}

function showAuthError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function showDashboard() {
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
    document.getElementById('user-email').textContent = userEmail;
    loadTasks();
}

// ========== TASKS ==========
async function loadTasks() {
    try {
        const res = await fetch(`${API}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
            handleLogout();
            showToast('Session expired. Please login again.', 'error');
            return;
        }

        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        showToast('Failed to load tasks', 'error');
    }
}

function renderTasks(tasks) {
    const list = document.getElementById('task-list');
    const empty = document.getElementById('empty-state');

    // Update stats
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-done').textContent = done;
    document.getElementById('stat-pending').textContent = total - done;

    if (tasks.length === 0) {
        list.innerHTML = '';
        list.appendChild(createEmptyState());
        return;
    }

    // Sort: pending first, then completed
    tasks.sort((a, b) => a.completed - b.completed);

    list.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-check ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})">
                ${task.completed ? '✓' : ''}
            </div>
            <div class="task-info">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn-icon edit" onclick="openEditModal(${task.id}, '${escapeAttr(task.title)}', '${escapeAttr(task.description || '')}')">✎</button>
                <button class="btn-icon delete" onclick="deleteTask(${task.id})">✕</button>
            </div>
        </div>
    `).join('');
}

function createEmptyState() {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.id = 'empty-state';
    div.innerHTML = '<div class="empty-icon">📋</div><p>No tasks yet. Add one above!</p>';
    return div;
}

async function handleCreateTask(e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-desc').value.trim();

    if (!title) return;

    try {
        const res = await fetch(`${API}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description: description || null })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to create task');
        }

        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        loadTasks();
        showToast('Task created!', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function toggleTask(id) {
    try {
        const res = await fetch(`${API}/tasks/${id}/toggle`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to toggle');
        loadTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to delete');
        loadTasks();
        showToast('Task deleted', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openEditModal(id, title, description) {
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `
        <div class="modal">
            <h3>Edit Task</h3>
            <div class="input-group">
                <label>Title</label>
                <input type="text" id="edit-title" value="${escapeAttr(title)}">
            </div>
            <div class="input-group" style="margin-top: 14px;">
                <label>Description</label>
                <input type="text" id="edit-desc" value="${escapeAttr(description)}">
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn-save" onclick="saveEdit(${id})">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById('edit-title').focus();
}

async function saveEdit(id) {
    const title = document.getElementById('edit-title').value.trim();
    const description = document.getElementById('edit-desc').value.trim();

    if (!title) {
        showToast('Title is required', 'error');
        return;
    }

    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description: description || null })
        });

        if (!res.ok) throw new Error('Failed to update');

        document.querySelector('.modal-overlay').remove();
        loadTasks();
        showToast('Task updated!', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ========== UTILS ==========
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escapeAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
