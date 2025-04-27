// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.toggleAttribute('data-theme');
  if (document.body.hasAttribute('data-theme')) {
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
});

// Calculate attendance
const calculateBtn = document.getElementById('calculate-btn');
calculateBtn.addEventListener('click', () => {
  const total = parseInt(document.getElementById('total-classes').value);
  const missed = parseInt(document.getElementById('missed-classes').value);
  const threshold = parseFloat(document.getElementById('threshold').value);
  const result = document.getElementById('result');

  if (isNaN(total) || isNaN(missed) || isNaN(threshold) || total <= 0 || missed > total) {
    result.textContent = "🚫 Please enter valid numbers!";
    return;
  }

  const attended = total - missed;
  const currentAttendance = (attended / total) * 100;

  let x = 0;
  while (true) {
    let new_attended = attended + x;
    let new_total = total + x;
    let new_attendance = (new_attended / new_total) * 100;
    if (new_attendance >= threshold) {
      break;
    }
    x++;
  }

  result.innerHTML = `
    ✅ Your Current Attendance: ${currentAttendance.toFixed(2)}%<br><br>
    🏆 Attend <b>${x}</b> more class(es) without missing<br>
    to reach <b>${threshold}%</b> attendance!
  `;

  gsap.fromTo(result, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 1});
});
