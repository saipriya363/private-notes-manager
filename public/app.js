// public/app.js
const API_BASE = '/api';

// ---------- Helper ----------
function showMessage(elem, text, success = false) {
  elem.textContent = text;
  elem.className = 'message';
  if (success) {
    elem.classList.add('success');
  }
}

function clearMessage(elem) {
  elem.textContent = '';
  elem.className = 'message';
}

// ---------- DOM Elements ----------
const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMsg = document.getElementById('auth-message');

const dashboard = document.getElementById('dashboard-section');
const welcomeMsg = document.getElementById('welcome-msg');
const logoutBtn = document.getElementById('logout-btn');
const noteMsg = document.getElementById('note-message');
const notesList = document.getElementById('notes-list');

// ---------- Form Switchers ----------
document.getElementById('show-register').addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  clearMessage(authMsg);
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  clearMessage(authMsg);
});

// ---------- Registration ----------
document.getElementById('register-btn').addEventListener('click', async () => {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  if (!name || !email || !password) {
    showMessage(authMsg, 'All fields are required.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(authMsg, data.message + ' Please login below.', true);
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = '';
    } else {
      showMessage(authMsg, data.message || 'Registration failed.');
    }
  } catch (err) {
    showMessage(authMsg, 'Network error. Please try again.');
  }
});

// ---------- Login ----------
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showMessage(authMsg, 'Email and password are required.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      initDashboard();
    } else {
      showMessage(authMsg, data.message || 'Login failed.');
    }
  } catch (err) {
    showMessage(authMsg, 'Network error. Please try again.');
  }
});

// ---------- Logout ----------
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  dashboard.classList.add('hidden');
  authSection.classList.remove('hidden');
  clearMessage(authMsg);
  document.getElementById('login-password').value = '';
});

// ---------- Add Note ----------
document.getElementById('save-note-btn').addEventListener('click', async () => {
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value.trim();

  if (!title || !content) {
    showMessage(noteMsg, 'Title and content are required.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    logoutBtn.click();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(noteMsg, 'Note saved successfully!', true);
      document.getElementById('note-title').value = '';
      document.getElementById('note-content').value = '';
      loadNotes();
      setTimeout(() => clearMessage(noteMsg), 3000);
    } else {
      if (res.status === 401) {
        alert('Session expired. Please log in again.');
        logoutBtn.click();
      } else {
        showMessage(noteMsg, data.message || 'Failed to save note.');
      }
    }
  } catch (err) {
    showMessage(noteMsg, 'Network error. Could not save note.');
  }
});

// ---------- Render Note Card safely using textContent ----------
function createNoteCard(note) {
  const card = document.createElement('div');
  card.className = 'note-card';

  const title = document.createElement('h4');
  title.textContent = note.title;

  const body = document.createElement('p');
  body.textContent = note.content;

  const date = document.createElement('div');
  date.className = 'date';
  date.textContent = new Date(note.createdAt).toLocaleString();

  const delBtn = document.createElement('button');
  delBtn.className = 'del-btn';
  delBtn.innerHTML = '&times;';
  delBtn.title = 'Delete note';
  delBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/notes/${note._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        loadNotes();
      } else {
        alert(data.message || 'Could not delete note.');
      }
    } catch (e) {
      alert('Network error while deleting note.');
    }
  });

  card.appendChild(delBtn);
  card.appendChild(title);
  card.appendChild(body);
  card.appendChild(date);
  return card;
}

// ---------- Load Notes ----------
async function loadNotes() {
  notesList.innerHTML = '<p>Loading notes...</p>';
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      alert('Session expired. Please log in again.');
      logoutBtn.click();
      return;
    }

    const notes = await res.json();
    if (res.ok) {
      notesList.innerHTML = '';
      if (!Array.isArray(notes) || notes.length === 0) {
        notesList.innerHTML = '<p style="color:#718096; grid-column: 1/-1;">No notes yet. Create your first note above!</p>';
        return;
      }
      notes.forEach((n) => notesList.appendChild(createNoteCard(n)));
    } else {
      notesList.innerHTML = '<p style="color:#e53e3e;">Failed to load notes.</p>';
    }
  } catch (err) {
    notesList.innerHTML = '<p style="color:#e53e3e;">Network error loading notes.</p>';
  }
}

// ---------- Initialize Dashboard ----------
function initDashboard() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('userName');
  if (!token) {
    dashboard.classList.add('hidden');
    authSection.classList.remove('hidden');
    return;
  }
  authSection.classList.add('hidden');
  dashboard.classList.remove('hidden');
  welcomeMsg.textContent = `Welcome, ${name || 'User'}!`;
  loadNotes();
}

window.addEventListener('DOMContentLoaded', initDashboard);

