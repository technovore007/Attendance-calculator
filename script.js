document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Initialize all app features
function initApp() {
    initThemeToggle();
    initCalculator();
    initResetButton();
}

// Theme Toggle with smooth animations
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initialize theme based on user preference
    if (localStorage.getItem('theme')) {
        document.body.dataset.theme = localStorage.getItem('theme');
        updateThemeIcon(document.body.dataset.theme === 'dark');
    } else if (prefersDarkScheme.matches) {
        document.body.dataset.theme = 'dark';
        updateThemeIcon(true);
    } else {
        document.body.dataset.theme = '';
        updateThemeIcon(false);
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.dataset.theme === 'dark';
        document.body.dataset.theme = isDark ? '' : 'dark';
        localStorage.setItem('theme', document.body.dataset.theme);
        updateThemeIcon(!isDark);
    });
    
    // Update theme icon based on current theme
    function updateThemeIcon(isDark) {
        themeToggle.textContent = isDark ? '🌞' : '🌙';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.body.dataset.theme = e.matches ? 'dark' : '';
            updateThemeIcon(e.matches);
        }
    });
}

// Calculate Attendance with optimized performance
function initCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const extraClassesToggle = document.getElementById('extra-classes-toggle');
    
    calculateBtn.addEventListener('click', () => {
        // Get input values
        const total = parseInt(document.getElementById('total-classes').value);
        const missed = parseInt(document.getElementById('missed-classes').value);
        const extra = parseInt(document.getElementById('extra-classes').value) || 0;
        const threshold = parseFloat(document.getElementById('threshold').value);
        const countExtraInTotal = extraClassesToggle.checked;
        
        // Validate inputs
        if (isNaN(total) || isNaN(missed) || total <= 0 || missed < 0 || threshold <= 0) {
            showResult("⚠️ Please enter valid numbers.", "warning");
            return;
        }
        
        // Calculate attendance based on extra classes settings
        let attendedClasses = total - missed;
        let totalForCalculation;
        
        if (countExtraInTotal) {
            // Toggle ON: Extra classes are included in attendance but not in total
            totalForCalculation = total - extra;
        } else {
            // Toggle OFF: Extra classes are added to attendance but total remains unchanged
            attendedClasses = attendedClasses + extra;
            totalForCalculation = total;
        }
        
        const currentAttendance = (attendedClasses / totalForCalculation) * 100;
        
        // Generate result message with enhanced formatting
        let message = `<div class="result-section">`;
        message += `<span class="result-title">Current Attendance</span>`;
        message += `<span class="result-value">${currentAttendance.toFixed(2)}%</span>`;
        message += `</div>`;
        
        message += `<div class="result-section">`;
        message += `<span class="result-detail">Classes Attended: <strong>${attendedClasses}</strong> / <strong>${totalForCalculation}</strong></span>`;
        message += `</div>`;
        
        if (currentAttendance < threshold) {
            // Calculate classes needed to reach threshold
            let needed = Math.ceil((threshold * totalForCalculation - 100 * attendedClasses) / (100 - threshold));
            
            message += `<div class="result-section warning">`;
            message += `<span class="result-action">📈 You need to attend at least <strong>${needed}</strong> more class(es) to reach ${threshold}%.</span>`;
            message += `</div>`;
            
            showResult(message, "warning");
        } else {
            message += `<div class="result-section success">`;
            message += `<span class="result-action">🎉 Congratulations! You are above the ${threshold}% threshold!</span>`;
            message += `</div>`;
            
            showResult(message, "success");
            
            // Launch celebration confetti
            launchCelebration();
        }
    });
    
    // Display result with optimized animation
    function showResult(message, type) {
        // First hide the result if it's already shown
        resultDiv.classList.remove('show');
        
        // Clear previous content
        resultDiv.innerHTML = '';
        
        // Set new content after animation completes
        setTimeout(() => {
            resultDiv.innerHTML = message;
            resultDiv.className = type;
            
            // Force reflow
            void resultDiv.offsetWidth;
            
            // Show with animation
            resultDiv.classList.add('show');
        }, 300);
    }
    
    function launchCelebration() {
        // Use canvas-confetti library for celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6a60a9', '#3a7bd5', '#00b09b', '#f7971e', '#ff416c'],
            shapes: ['circle', 'square']
        });
    }
}

// Initialize reset button
function initResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    
    resetBtn.addEventListener('click', () => {
        // Reset all inputs
        document.getElementById('total-classes').value = '';
        document.getElementById('missed-classes').value = '';
        document.getElementById('extra-classes').value = '0';
        document.getElementById('threshold').value = '80';
        document.getElementById('extra-classes-toggle').checked = false;
        
        // Hide result
        const resultDiv = document.getElementById('result');
        resultDiv.classList.remove('show');
        
        // Clear result content after animation
        setTimeout(() => {
            resultDiv.innerHTML = '';
        }, 300);
    });
}