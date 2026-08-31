// ============================================
// GymNexus — Member Portal Logic
// (Mock data for one logged-in member; swap
//  fetch() calls in for the real REST APIs later)
//
// If name/phone/plan arrive as URL params (from
// the signup form on the landing page), this is
// a brand-new member — show fresh/empty data
// instead of the demo mock member.
// ============================================

const todayStr = () => new Date().toISOString().split('T')[0];
document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long', year:'numeric'});

const urlParams = new URLSearchParams(window.location.search);
const urlName = urlParams.get('name');
const urlPhone = urlParams.get('phone');
const urlPlan = urlParams.get('plan');
const isNewSignup = !!urlName;

function planDays(planValue){
  if(planValue==='monthly') return 30;
  if(planValue==='yearly') return 365;
  return 90; // quarterly / default
}
function planLabel(planValue){
  if(planValue==='monthly') return 'Monthly';
  if(planValue==='yearly') return 'Yearly';
  return 'Quarterly';
}

const member = isNewSignup ? {
  name: urlName,
  phone: urlPhone || '—',
  plan: planLabel(urlPlan),
  joined: todayStr(),
  end: new Date(Date.now() + planDays(urlPlan)*86400000).toISOString().split('T')[0],
} : {
  name:'Priya Nair',
  phone:'98221xxxxx',
  plan:'Quarterly',
  joined:'2026-06-14',
  end:'2026-09-14',
};

// A new member has no trainer/diet plan assigned yet — that happens from
// the admin side after they join.
const trainer = isNewSignup ? null : {
  name:'Meera Iyer',
  spec:'Yoga & Mobility',
  contact:'meera@gymnexus.in',
};

const dietPlan = isNewSignup ? null : {
  details:'High-protein, 2200 kcal — 4 meals/day, focus on lean sources and post-workout recovery.',
  allocated:'2026-08-10',
  by:'Meera Iyer',
};

// Every member automatically gets a day-wise diet suggestion — no admin
// action needed for this base plan. Admin can still add an additional,
// more specific plan (dietPlan above) on top of it.
const dietByDay = {
  Monday:'High-protein day — eggs, grilled chicken/paneer, dal, and a big portion of vegetables. Fuel up for the week.',
  Tuesday:'Balanced day — mixed vegetables, roti, curd, and a moderate portion of lean protein.',
  Wednesday:'Carb-focused day — brown rice or oats, banana, and nut butter to support mid-week training volume.',
  Thursday:'High-protein day — fish/tofu, quinoa or dal, and leafy greens for recovery.',
  Friday:'Light & clean day — soups, salads, sprouts, and lighter portions to close out the week.',
  Saturday:'Performance day — complex carbs, chicken/paneer, and healthy fats for your heaviest training day.',
  Sunday:'Recovery day — home-cooked meals, extra hydration, and fruit; keep it simple and easy on digestion.',
};
function todaysAutoDiet(){
  const dayName = new Date().toLocaleDateString('en-US', { weekday:'long' });
  return { day: dayName, details: dietByDay[dayName] };
}

// A new member has no attendance history yet.
let attendanceLog = isNewSignup ? [] : [
  {date:'2026-08-21', status:'present', time:'07:15 AM'},
  {date:'2026-08-22', status:'present', time:'07:05 AM'},
  {date:'2026-08-23', status:'absent', time:'—'},
  {date:'2026-08-24', status:'present', time:'06:58 AM'},
  {date:'2026-08-25', status:'present', time:'07:20 AM'},
  {date:'2026-08-26', status:'absent', time:'—'},
  {date:'2026-08-27', status:'present', time:'07:02 AM'},
  {date:'2026-08-28', status:'present', time:'07:10 AM'},
  {date:'2026-08-29', status:'present', time:'06:55 AM'},
  {date:'2026-08-30', status:'absent', time:'—'},
];

function daysBetween(a,b){ return Math.ceil((new Date(a)-new Date(b))/(1000*60*60*24)); }

function subStatus(endDate){
  const diff = daysBetween(endDate, todayStr());
  if(diff < 0) return 'expired';
  if(diff <= 7) return 'expiring';
  return 'active';
}

function initials(name){
  return name.split(' ').filter(Boolean).map(p=>p[0]).join('').toUpperCase().slice(0,2) || '?';
}

function currentStreak(){
  let streak = 0;
  for(let i = attendanceLog.length-1; i>=0; i--){
    if(attendanceLog[i].status==='present') streak++;
    else break;
  }
  return streak;
}

function renderOverview(){
  document.getElementById('avatarInitials').textContent = initials(member.name);
  document.getElementById('profileName').textContent = member.name;
  document.getElementById('profileMeta').textContent = `${member.plan} Member · Since ${member.joined}`;
  document.getElementById('footName').textContent = member.name;

  const daysLeft = Math.max(daysBetween(member.end, todayStr()), 0);
  document.getElementById('statDaysLeft').textContent = daysLeft;
  document.getElementById('statAttendance').textContent = attendanceLog.filter(a=>a.status==='present').length;
  document.getElementById('statStreak').textContent = currentStreak();
  document.getElementById('statPlan').textContent = member.plan;

  document.getElementById('daysOverview').innerHTML = attendanceLog.length
    ? renderDayStrip(attendanceLog.slice(-7))
    : '<div class="empty">No check-ins yet — mark your first attendance from the Attendance tab.</div>';
}

function renderDayStrip(log){
  return log.map(a=>{
    const d = new Date(a.date);
    const dayNum = d.getDate();
    const dayLabel = d.toLocaleDateString('en-IN',{weekday:'short'});
    return `<div class="day-chip ${a.status}"><div class="d">${dayNum}</div><div>${dayLabel}</div></div>`;
  }).join('');
}

function renderSubscription(){
  const st = subStatus(member.end);
  document.getElementById('subPill').textContent = st;
  document.getElementById('subPill').className = 'pill ' + st;
  document.getElementById('subPlan').textContent = member.plan;
  document.getElementById('subStart').textContent = member.joined;
  document.getElementById('subEnd').textContent = member.end;
  document.getElementById('subDaysLeft').textContent = Math.max(daysBetween(member.end, todayStr()), 0) + ' days';
}

function renderAttendance(){
  document.getElementById('daysAttendance').innerHTML = attendanceLog.length
    ? renderDayStrip(attendanceLog.slice(-7))
    : '<div class="empty">No attendance recorded yet.</div>';
  document.getElementById('attHistoryBody').innerHTML = [...attendanceLog].reverse().map(a=>`
    <tr><td>${a.date}</td><td><span class="pill ${a.status}">${a.status}</span></td><td>${a.time}</td></tr>
  `).join('') || '<tr><td class="empty" colspan="3">No attendance history yet</td></tr>';
}

function renderDiet(){
  const auto = todaysAutoDiet();
  let html = `
    <div class="info-card" style="max-width:480px; margin-bottom:14px;">
      <div class="name">Today's Diet Plan · ${auto.day}</div>
      <div class="spec">Auto-generated for you</div>
      <div class="contact">${auto.details}</div>
    </div>
  `;
  html += dietPlan ? `
    <div class="info-card" style="max-width:480px;">
      <div class="name">Additional Plan from Your Trainer</div>
      <div class="spec">By ${dietPlan.by} · Allocated ${dietPlan.allocated}</div>
      <div class="contact">${dietPlan.details}</div>
    </div>
  ` : `<div class="empty" style="text-align:left; padding:12px 0 0;">Your trainer hasn't added anything extra yet.</div>`;
  document.getElementById('dietBody').innerHTML = html;
}

function renderTrainer(){
  document.getElementById('trainerCard').innerHTML = trainer ? `
    <div class="info-card">
      <div class="name">${trainer.name}</div>
      <div class="spec">${trainer.spec}</div>
      <div class="contact">${trainer.contact}</div>
    </div>
  ` : `<div class="empty">No trainer assigned yet — check back after the gym allocates one.</div>`;
}

function renderAll(){
  renderOverview(); renderSubscription(); renderAttendance(); renderDiet(); renderTrainer();
}

function checkInToday(){
  const today = todayStr();
  const existing = attendanceLog.find(a=>a.date===today);
  if(existing){
    existing.status = 'present';
    existing.time = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  } else {
    attendanceLog.push({date:today, status:'present', time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});
  }
  renderAll();
}

function renewSubscription(){
  const days = member.plan==='Monthly'?30:member.plan==='Quarterly'?90:365;
  member.end = new Date(new Date(member.end).getTime()+days*86400000).toISOString().split('T')[0];
  renderAll();
}

// Nav switching
document.getElementById('nav').addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-section]');
  if(!btn) return;
  document.querySelectorAll('#nav button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-'+btn.dataset.section).classList.add('active');
  document.getElementById('pageTitle').textContent = btn.textContent;
});

renderAll();
