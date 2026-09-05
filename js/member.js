// ============================================
// my GymNexus — Member Portal Logic (connected to
// the real Spring Boot backend)
// ============================================

const API_BASE = 'http://localhost:8080/api';
const token = localStorage.getItem('gymnexus_token');
const role = localStorage.getItem('gymnexus_role');

if (!token || role !== 'MEMBER') {
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

let member = null;
let trainerInfo = null;
let dietAuto = null;
let dietAdditional = null;
let attendanceLog = [];
 // array of { date, checkInTime } — only PRESENT days exist as rows

function initials(name) {
  return name.split(' ').filter(Boolean).map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function formatTime(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

function capitalizeDay(day) {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

function lastNDates(n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().split('T')[0]);
  }
  return arr;
}

function isPresentOn(dateStr) {
  return attendanceLog.some(a => a.date === dateStr);
}

function timeOn(dateStr) {
  const rec = attendanceLog.find(a => a.date === dateStr);
  return rec ? formatTime(rec.checkInTime) : '—';
}

function currentStreak() {
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    if (isPresentOn(ds)) streak++; else break;
  }
  return streak;
}

async function loadAll() {
  try {
    const [profileRes, autoRes, additionalRes, historyRes, trainersRes] = await Promise.all([
      fetch(`${API_BASE}/members/me`, { headers: authHeaders() }),
      fetch(`${API_BASE}/diet/today`, { headers: authHeaders() }),
      fetch(`${API_BASE}/diet/me/additional`, { headers: authHeaders() }),
      fetch(`${API_BASE}/attendance/me`, { headers: authHeaders() }),
      fetch(`${API_BASE}/trainers`, { headers: authHeaders() }),
    ]);

    if (profileRes.status === 401) { logout(); return; }

    member = await profileRes.json();
    dietAuto = autoRes.ok ? await autoRes.json() : null;
    dietAdditional = additionalRes.status === 200 ? await additionalRes.json() : null;
    attendanceLog = historyRes.ok ? await historyRes.json() : [];
    const trainers = trainersRes.ok ? await trainersRes.json() : [];
    trainerInfo = member.trainerName ? trainers.find(t => t.name === member.trainerName) : null;

    renderAll();
  } catch (e) {
    console.error(e);
    alert('Could not load your dashboard. Make sure the backend is running on port 8080.');
  }
}

function renderOverview() {
  document.getElementById('avatarInitials').textContent = initials(member.name);
  document.getElementById('profileName').textContent = member.name;
  document.getElementById('profileMeta').textContent = `${member.plan} Member · Since ${member.joined}`;
  document.getElementById('footName').textContent = member.name;

  document.getElementById('statDaysLeft').textContent = member.daysLeft;
  const thisMonth = todayStr().slice(0, 7);
  document.getElementById('statAttendance').textContent = attendanceLog.filter(a => a.date.startsWith(thisMonth)).length;
  document.getElementById('statStreak').textContent = currentStreak();
  document.getElementById('statPlan').textContent = member.plan;

  document.getElementById('daysOverview').innerHTML = renderDayStrip(lastNDates(7));
}

function renderDayStrip(dates) {
  return dates.map(ds => {
    const d = new Date(ds);
    const dayNum = d.getDate();
    const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const present = isPresentOn(ds);
    return `<div class="day-chip ${present ? 'present' : 'absent'}"><div class="d">${dayNum}</div><div>${dayLabel}</div></div>`;
  }).join('');
}

function renderSubscription() {
  document.getElementById('subPill').textContent = member.status;
  document.getElementById('subPill').className = 'pill ' + member.status;
  document.getElementById('subPlan').textContent = member.plan;
  document.getElementById('subStart').textContent = member.joined;
  document.getElementById('subEnd').textContent = member.end;
  document.getElementById('subDaysLeft').textContent = member.daysLeft + ' days';
}

function renderAttendance() {
  document.getElementById('daysAttendance').innerHTML = renderDayStrip(lastNDates(7));
  const sorted = [...attendanceLog].sort((a, b) => b.date.localeCompare(a.date));
  document.getElementById('attHistoryBody').innerHTML = sorted.map(a => `
    <tr><td>${a.date}</td><td><span class="pill present">present</span></td><td>${formatTime(a.checkInTime)}</td></tr>
  `).join('') || '<tr><td class="empty" colspan="3">No attendance history yet</td></tr>';
}

function renderDiet() {
  let html = '';
  if (dietAuto) {
    html += `
      <div class="info-card" style="max-width:480px; margin-bottom:14px;">
        <div class="name">Today's Diet Plan · ${capitalizeDay(dietAuto.dayOfWeek)}</div>
        <div class="spec">Auto-generated for you</div>
        <div class="contact">${dietAuto.details}</div>
      </div>
    `;
  }
  html += dietAdditional ? `
    <div class="info-card" style="max-width:480px;">
      <div class="name">Additional Plan from Your Trainer</div>
      <div class="spec">By ${dietAdditional.trainerName || 'Admin'} · Allocated ${dietAdditional.allocatedDate}</div>
      <div class="spec">By ${dietAdditional.trainer ? dietAdditional.trainer.name : 'Admin'} · Allocated ${dietAdditional.allocatedDate}</div>
      <div class="contact">${dietAdditional.details}</div>
    </div>
  ` : `<div class="empty" style="text-align:left; padding:12px 0 0;">Your trainer hasn't added anything extra yet.</div>`;
  document.getElementById('dietBody').innerHTML = html;
}

function renderTrainer() {
  document.getElementById('trainerCard').innerHTML = trainerInfo ? `
    <div class="info-card">
      <div class="name">${trainerInfo.name}</div>
      <div class="spec">${trainerInfo.specialization}</div>
      <div class="contact">${trainerInfo.contact}</div>
    </div>
  ` : `<div class="empty">No trainer assigned yet — check back after the gym allocates one.</div>`;
}

function renderAll() {
  renderOverview(); renderSubscription(); renderAttendance(); renderDiet(); renderTrainer();
}

async function checkInToday() {
  try {
    await fetch(`${API_BASE}/attendance/checkin`, { method: 'POST', headers: authHeaders() });
    await loadAll();
  } catch (e) {
    alert('Could not check in — is the backend running?');
  }
}

async function renewSubscription() {
  try {
    await fetch(`${API_BASE}/subscriptions/me/renew`, { method: 'POST', headers: authHeaders() });
    await loadAll();
  } catch (e) {
    alert('Could not renew — is the backend running?');
  }
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