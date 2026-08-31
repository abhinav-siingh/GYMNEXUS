// ============================================
// GymNexus — Landing Page Logic
// (Mock auth: in the real app, this calls the
//  Spring Boot /api/auth endpoints and redirects
//  based on the returned role/token)
// ============================================

function openAuth(tab){
  document.getElementById('authModal').classList.add('open');
  switchTab(tab);
}

function closeAuth(){
  document.getElementById('authModal').classList.remove('open');
}

function switchTab(tab){
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabSignup').classList.toggle('active', tab==='signup');
  document.getElementById('formLogin').classList.toggle('active', tab==='login');
  document.getElementById('formSignup').classList.toggle('active', tab==='signup');
}

function submitAuth(type){
  if(type === 'login'){
    const role = document.getElementById('loginRole').value;
    window.location.href = role === 'admin' ? 'admin.html' : 'member.html';
    return;
  }

  // Signup is always for members — the admin is the gym owner and only
  // ever logs in, never signs up.
  // (Real version: this would be a POST to /api/members, and the
  //  dashboard would load the new member by their returned ID/token.)
  const name = document.getElementById('suName').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const plan = document.getElementById('suPlan').value;

  // Shared storage so the admin portal sees this member without a backend.
  // Once the real Spring Boot API exists, this becomes a POST /api/members
  // call instead, and the admin dashboard fetches the live member list.
  const newMember = { name, phone, plan, joined: new Date().toISOString().split('T')[0] };
  const existing = JSON.parse(localStorage.getItem('gymnexus_signups') || '[]');
  existing.push(newMember);
  localStorage.setItem('gymnexus_signups', JSON.stringify(existing));

  const params = new URLSearchParams({ name, phone, plan });
  window.location.href = 'member.html?' + params.toString();
}

function calculateBMI(){
  const h = parseFloat(document.getElementById('bmiHeight').value);
  const w = parseFloat(document.getElementById('bmiWeight').value);
  const resultEl = document.getElementById('bmiResult');
  if(!h || !w || h <= 0 || w <= 0){
    resultEl.innerHTML = '<span class="bmi-hint">Enter a valid height and weight.</span>';
    return;
  }
  const heightM = h / 100;
  const bmi = w / (heightM * heightM);
  let category, cls;
  if(bmi < 18.5){ category = 'Underweight'; cls = 'warn'; }
  else if(bmi < 25){ category = 'Normal'; cls = 'active'; }
  else if(bmi < 30){ category = 'Overweight'; cls = 'warn'; }
  else { category = 'Obese'; cls = 'expired'; }
  resultEl.innerHTML = `<span class="bmi-value">${bmi.toFixed(1)}</span><span class="pill ${cls}">${category}</span>`;
}

// Close modal when clicking the dark overlay (not the box itself)
document.getElementById('authModal').addEventListener('click', (e)=>{
  if(e.target.id === 'authModal') closeAuth();
});
