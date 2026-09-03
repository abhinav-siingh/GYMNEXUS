// ============================================
// GymNexus — Landing Page Logic (connected to
// the real Spring Boot backend)
// ============================================

const API_BASE = 'http://localhost:8080/api';

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
  clearErrors();
}

function showError(formType, message){
  const el = document.getElementById(formType === 'login' ? 'loginError' : 'signupError');
  if(el){ el.textContent = message; el.style.display = 'block'; }
}

function clearErrors(){
  ['loginError','signupError'].forEach(id=>{
    const el = document.getElementById(id);
    if(el){ el.style.display = 'none'; el.textContent = ''; }
  });
}

function saveSession(data){
  localStorage.setItem('gymnexus_token', data.token);
  localStorage.setItem('gymnexus_role', data.role);
  localStorage.setItem('gymnexus_name', data.name);
  localStorage.setItem('gymnexus_id', data.id);
}

async function submitAuth(type){
  clearErrors();

  if(type === 'login'){
    const phone = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPass').value;
    try{
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({}));
        showError('login', err.message || 'Invalid phone number or password.');
        return;
      }
      const data = await res.json();
      saveSession(data);
      window.location.href = data.role === 'ADMIN' ? 'admin.html' : 'member.html';
    } catch(e){
      showError('login', 'Could not reach the server — is the backend running on port 8080?');
    }
    return;
  }

  // Signup is always for members.
  const name = document.getElementById('suName').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const password = document.getElementById('suPass').value;
  const plan = document.getElementById('suPlan').value;

  try{
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password, plan })
    });
    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      showError('signup', err.message || 'Signup failed — please check your details.');
      return;
    }
    const data = await res.json();
    saveSession(data);
    window.location.href = 'member.html';
  } catch(e){
    showError('signup', 'Could not reach the server — is the backend running on port 8080?');
  }
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

document.getElementById('authModal').addEventListener('click', (e)=>{
  if(e.target.id === 'authModal') closeAuth();
});