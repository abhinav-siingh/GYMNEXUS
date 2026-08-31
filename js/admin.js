// ============================================
// GymNexus — Admin Console Logic
// (Mock in-memory data; swap fetch() calls in
//  for the real Spring Boot REST APIs later)
// ============================================

const todayStr = () => new Date().toISOString().split('T')[0];
document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long', year:'numeric'});
document.getElementById('attDate').textContent = todayStr();

let members = [
  {id:1, name:'Rohit Sharma', phone:'98765xxxxx', plan:'Monthly', joined:'2026-08-02', end:'2026-09-02'},
  {id:2, name:'Priya Nair', phone:'98221xxxxx', plan:'Quarterly', joined:'2026-06-14', end:'2026-09-14'},
  {id:3, name:'Ankit Verma', phone:'99887xxxxx', plan:'Yearly', joined:'2026-01-10', end:'2027-01-10'},
  {id:4, name:'Sneha Kapoor', phone:'97001xxxxx', plan:'Monthly', joined:'2026-08-20', end:'2026-09-05'},
  {id:5, name:'Vikram Rathore', phone:'96554xxxxx', plan:'Monthly', joined:'2026-07-30', end:'2026-08-30'},
];
let nextMemberId = 6;

// Members who signed up from the landing page (no backend yet, so this
// reads from shared storage). Once the Spring Boot API exists, this
// becomes a GET /api/members call instead.
function planDaysFor(plan){
  if(plan==='monthly') return 30;
  if(plan==='yearly') return 365;
  return 90;
}
function planLabelFor(plan){
  if(plan==='monthly') return 'Monthly';
  if(plan==='yearly') return 'Yearly';
  return 'Quarterly';
}
const signups = JSON.parse(localStorage.getItem('gymnexus_signups') || '[]');
signups.forEach(s=>{
  const end = new Date(new Date(s.joined).getTime() + planDaysFor(s.plan)*86400000).toISOString().split('T')[0];
  members.push({id:nextMemberId++, name:s.name, phone:s.phone || '—', plan:planLabelFor(s.plan), joined:s.joined, end});
});

let trainers = [
  {id:1, name:'Karan Malhotra', spec:'Strength & Conditioning', contact:'karan@gymnexus.in'},
  {id:2, name:'Meera Iyer', spec:'Yoga & Mobility', contact:'meera@gymnexus.in'},
  {id:3, name:'Aditya Singh', spec:'Nutrition & Weight Loss', contact:'aditya@gymnexus.in'},
];

let attendance = {}; // memberId -> {status, time}
let dietPlans = [];
let nextDietId = 1;

function daysBetween(a,b){ return Math.ceil((new Date(a)-new Date(b))/(1000*60*60*24)); }

function subStatus(endDate){
  const diff = daysBetween(endDate, todayStr());
  if(diff < 0) return 'expired';
  if(diff <= 7) return 'expiring';
  return 'active';
}

function renderDashboard(){
  document.getElementById('statMembers').textContent = members.length;
  const checkins = Object.values(attendance).filter(a=>a.status==='present').length;
  document.getElementById('statCheckins').textContent = checkins;
  const expiring = members.filter(m=>subStatus(m.end)==='expiring').length;
  document.getElementById('statExpiring').textContent = expiring;
  document.getElementById('statTrainers').textContent = trainers.length;

  const recent = [...members].sort((a,b)=>new Date(b.joined)-new Date(a.joined)).slice(0,5);
  document.getElementById('recentBody').innerHTML = recent.map(m=>{
    const st = subStatus(m.end);
    return `<tr><td>${m.name}</td><td>${m.plan}</td><td>${m.joined}</td><td><span class="pill ${st}">${st}</span></td></tr>`;
  }).join('') || '<tr><td class="empty" colspan="4">No members yet</td></tr>';
}

function renderMembers(){
  document.getElementById('membersBody').innerHTML = members.map(m=>{
    const st = subStatus(m.end);
    return `<tr><td>${m.name}</td><td>${m.phone}</td><td>${m.plan}</td><td>${m.joined}</td><td><span class="pill ${st}">${st}</span></td></tr>`;
  }).join('') || '<tr><td class="empty" colspan="5">No members yet</td></tr>';
}

function renderTrainers(){
  document.getElementById('trainerCards').innerHTML = trainers.map(t=>`
    <div class="info-card">
      <div class="name">${t.name}</div>
      <div class="spec">${t.spec}</div>
      <div class="contact">${t.contact}</div>
    </div>`).join('');
}

function renderAttendance(){
  document.getElementById('attBody').innerHTML = members.map(m=>{
    const a = attendance[m.id];
    const status = a ? a.status : 'absent';
    const time = a ? a.time : '—';
    const btnLabel = status==='present' ? 'Mark Absent' : 'Mark Present';
    return `<tr><td>${m.name}</td><td><span class="pill ${status}">${status}</span></td><td>${time}</td>
      <td><button class="ghost" onclick="toggleAttendance(${m.id})">${btnLabel}</button></td></tr>`;
  }).join('');
}

function renderSubs(){
  document.getElementById('subsBody').innerHTML = members.map(m=>{
    const st = subStatus(m.end);
    return `<tr><td>${m.name}</td><td>${m.plan}</td><td>${m.joined}</td><td>${m.end}</td><td><span class="pill ${st}">${st}</span></td></tr>`;
  }).join('');
}

function renderDietSelectors(){
  document.getElementById('dMember').innerHTML = members.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
  document.getElementById('dTrainer').innerHTML = trainers.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
}

function renderDiet(){
  document.getElementById('dietBody').innerHTML = dietPlans.map(d=>{
    const m = members.find(x=>x.id===d.memberId);
    const t = trainers.find(x=>x.id===d.trainerId);
    return `<tr><td>${m?m.name:'—'}</td><td>${t?t.name:'—'}</td><td>${d.details}</td><td>${d.date}</td></tr>`;
  }).join('') || '<tr><td class="empty" colspan="4">No diet plans allocated yet</td></tr>';
}

function renderAll(){
  renderDashboard(); renderMembers(); renderTrainers(); renderAttendance(); renderSubs(); renderDietSelectors(); renderDiet();
}

function addMember(){
  const name = document.getElementById('mName').value.trim();
  const phone = document.getElementById('mPhone').value.trim();
  const plan = document.getElementById('mPlan').value;
  if(!name || !phone) return;
  const days = plan==='Monthly'?30:plan==='Quarterly'?90:365;
  const joined = todayStr();
  const end = new Date(Date.now()+days*86400000).toISOString().split('T')[0];
  members.push({id:nextMemberId++, name, phone, plan, joined, end});
  document.getElementById('mName').value=''; document.getElementById('mPhone').value='';
  renderAll();
}

function toggleAttendance(memberId){
  const a = attendance[memberId];
  if(a && a.status==='present'){
    delete attendance[memberId];
  } else {
    attendance[memberId] = {status:'present', time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})};
  }
  renderAll();
}

function addDiet(){
  const memberId = parseInt(document.getElementById('dMember').value);
  const trainerId = parseInt(document.getElementById('dTrainer').value);
  const details = document.getElementById('dDetails').value.trim();
  if(!details) return;
  dietPlans.push({id:nextDietId++, memberId, trainerId, details, date:todayStr()});
  document.getElementById('dDetails').value='';
  renderDiet();
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
