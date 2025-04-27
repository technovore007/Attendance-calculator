// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? '' : 'dark';
});

// Calculate Attendance
const calculateBtn = document.getElementById('calculate-btn');
const resultDiv = document.getElementById('result');

calculateBtn.addEventListener('click', () => {
  const total = parseInt(document.getElementById('total-classes').value);
  const missed = parseInt(document.getElementById('missed-classes').value);
  const threshold = parseFloat(document.getElementById('threshold').value);

  if (isNaN(total) || isNaN(missed) || total <= 0 || missed < 0 || threshold <= 0) {
    resultDiv.innerHTML = "⚠️ Please enter valid numbers.";
    return;
  }

  const attended = total - missed;
  const currentAttendance = (attended / total) * 100;

  let message = `✅ Current Attendance: ${currentAttendance.toFixed(2)}%`;

  if (currentAttendance < threshold) {
    let needed = Math.ceil((threshold * total - 100 * attended) / (100 - threshold));
    message += `<br>📈 Attend at least ${needed} more class(es) to reach ${threshold}%.`;
  } else {
    message += "<br>🎉 You are above the threshold!";
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  resultDiv.innerHTML = message;
});

// Page Load Animations
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('header h1').style.opacity = 0;
  document.querySelector('.container').style.opacity = 0;

  setTimeout(() => {
    document.querySelector('header h1').style.opacity = 1;
    document.querySelector('.container').style.opacity = 1;
  }, 300);
});

// PWA Install
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
});
