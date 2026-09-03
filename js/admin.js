// ============================================
// GymNexus — Admin Console Logic (connected to
// the real Spring Boot backend)
// ============================================

const API_BASE = 'http://localhost:8080/api';
const token = localStorage.getItem('gymnexus_token');
const role = localStorage.getItem('gymnexus_role');

if (!token || role !== 'ADMIN') {
  window.location.href = 'index.html';
}

function authHeaders() {
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

const todayStr = () => new Date().toISOString().split('T')[0];
document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
document.getElementById('attDate').textContent = todayStr();

let members = [];
let trainers = [];
let todayAttendance = [];
let dietPlans = [];

function formatTime(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

async function loadAll() {
  try {
    const [membersRes, trainersRes, attRes, dietRes] = await Promise.all([
      fetch(`${API_BASE}/members`, { headers: authHeaders() }),
      fetch(`${API_BASE}/trainers`, { headers: authHeaders() }),
      fetch(`${API_BASE}/attendance/today`, { headers: authHeaders() }),
      fetch(`${API_BASE}/diet/plans`, { headers: authHeaders() }),
    ]);

    if (membersRes.status === 401) { logout(); return; }

    members = membersRes.ok ? await membersRes.json() : [];
    trainers = trainersRes.ok ? await trainersRes.json() : [];
    todayAttendance = attRes.ok ? await attRes.json() : [];
    dietPlans = dietRes.ok ? await dietRes.json() : [];

    renderAll();
  } catch (e) {
    console.error(e);
    alert('Could not load the dashboard. Make sure the backend is running on port 8080.');
  }
}

function renderDashboard() {
  document.getElementById('statMembers').textContent = members.length;
  document.getElementById('statCheckins').textContent = todayAttendance.length;
  document.getElementById('statExpiring').textContent = members.filter(m => m.status === 'expiring').length;
  document.getElementById('statTrainers').textContent = trainers.length;

  const recent = [...members].sort((a, b) => new Date(b.joined) - new Date(a.joined)).slice(0, 5);
  document.getElementById('recentBody').innerHTML = recent.map(m => `
    <tr><td>${m.name}</td><td>${m.plan}</td><td>${m.joined}</td><td><span class="pill ${m.status}">${m.status}</span></td></tr>
  `).join('') || '<tr><td class="empty" colspan="4">No members yet</td></tr>';
}

function trainerOptions(selectedName) {
  return trainers.map(t => `<option value="${t.id}" ${t.name === selectedName ? 'selected' : ''}>${t.name}</option>`).join('');
}

function renderMembers() {
  document.getElementById('membersBody').innerHTML = members.map(m => `
    <tr>
      <td>${m.name}</td><td>${m.phone}</td><td>${m.plan}</td><td>${m.joined}</td>
      <td><span class="pill ${m.status}">${m.status}</span></td>
      <td>
        ${m.trainerName || '—'}<br>
        <select id="trainerSel-${m.id}" style="margin-top:4px;">${trainerOptions(m.trainerName)}</select>
        <button class="ghost" onclick="assignTrainer(${m.id})">Assign</button>
      </td>
    </tr>
  `).join('') || '<tr><td class="empty" colspan="6">No members yet</td></tr>';
}

async function assignTrainer(memberId) {
  const trainerId = document.getElementById(`trainerSel-${memberId}`).value;
  if (!trainerId) return;
  try {
    await fetch(`${API_BASE}/members/${memberId}/trainer`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify({ trainerId: parseInt(trainerId) })
    });
    await loadAll();
  } catch (e) {
    alert('Could not assign trainer.');
  }
}

function renderTrainers() {
  document.getElementById('trainerCards').innerHTML = trainers.map(t => `
    <div class="info-card">
      <div class="name">${t.name}</div>
      <div class="spec">${t.specialization}</div>
      <div class="contact">${t.contact}</div>
    </div>`).join('');
}

async function addTrainer() {
  const name = document.getElementById('tName').value.trim();
  const specialization = document.getElementById('tSpec').value.trim();
  const contact = document.getElementById('tContact').value.trim();
  if (!name || !specialization || !contact) return;
  try {
    await fetch(`${API_BASE}/trainers`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, specialization, contact }) });
    document.getElementById('tName').value = ''; document.getElementById('tSpec').value = ''; document.getElementById('tContact').value = '';
    await loadAll();
  } catch (e) {
    alert('Could not add trainer.');
  }
}

function renderAttendance() {
  document.getElementById('attBody').innerHTML = members.map(m => {
   
const rec = todayAttendance.find(a => a.memberId === m.id);    const status = rec ? 'present' : 'absent';
    const time = rec ? formatTime(rec.checkInTime) : '—';
    const btn = status === 'absent' ? `<button class="ghost" onclick="markPresent(${m.id})">Mark Present</button>` : '';
    return `<tr><td>${m.name}</td><td><span class="pill ${status}">${status}</span></td><td>${time}</td><td>${btn}</td></tr>`;
  }).join('');
}

async function markPresent(memberId) {
  try {
    await fetch(`${API_BASE}/attendance/mark`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ memberId }) });
    await loadAll();
  } catch (e) {
    alert('Could not mark attendance.');
  }
}

function renderSubs() {
  document.getElementById('subsBody').innerHTML = members.map(m => `
    <tr><td>${m.name}</td><td>${m.plan}</td><td>${m.joined}</td><td>${m.end}</td><td><span class="pill ${m.status}">${m.status}</span></td></tr>
  `).join('');
}

function renderDietSelectors() {
  document.getElementById('dMember').innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  document.getElementById('dTrainer').innerHTML = `<option value="">— No trainer —</option>` + trainers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function renderDiet() {
  document.getElementById('dietBody').innerHTML = dietPlans.map(d => `
<tr><td>${d.memberName}</td><td>${d.trainerName || '—'}</td><td>${d.details}</td><td>${d.allocatedDate}</td></tr>  `).join('') || '<tr><td class="empty" colspan="4">No diet plans allocated yet</td></tr>';
}

async function addDiet() {
  const memberId = parseInt(document.getElementById('dMember').value);
  const trainerVal = document.getElementById('dTrainer').value;
  const details = document.getElementById('dDetails').value.trim();
  if (!details) return;
  try {
    await fetch(`${API_BASE}/diet/assign`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ memberId, trainerId: trainerVal ? parseInt(trainerVal) : null, details })
    });
    document.getElementById('dDetails').value = '';
    await loadAll();
  } catch (e) {
    alert('Could not assign diet plan.');
  }
}

function renderAll() {
  renderDashboard(); renderMembers(); renderTrainers(); renderAttendance(); renderSubs(); renderDietSelectors(); renderDiet();
}

// Nav switching
document.getElementById('nav').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-section]');
  if (!btn) return;
  document.querySelectorAll('#nav button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + btn.dataset.section).classList.add('active');
  document.getElementById('pageTitle').textContent = btn.textContent;
});

loadAll();