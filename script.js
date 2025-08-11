// Enhanced Material Design 3 PWA with optimized performance
class AttendanceCalculator {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  async init() {
    this.checkInstallStatus();
    this.initTheme();
    this.initPWA();
    this.initCalculator();
    this.initInstallPrompt();
    this.registerServiceWorker();
    
    // Add subtle entrance animations
    requestAnimationFrame(() => {
      document.body.classList.add('loaded');
    });
  }

  // Theme Management with System Preference Support
  initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.dataset.theme = savedTheme;
      this.updateThemeIcon(savedTheme === 'dark');
    } else if (prefersDark.matches) {
      document.body.dataset.theme = 'dark';
      this.updateThemeIcon(true);
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.body.dataset.theme = e.matches ? 'dark' : '';
        this.updateThemeIcon(e.matches);
      }
    });
  }

  toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const isDark = document.body.dataset.theme === 'dark';
    
    // Add smooth rotation animation
    themeToggle.style.transform = 'rotate(180deg) scale(0.9)';
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
    
    setTimeout(() => {
      document.body.dataset.theme = isDark ? '' : 'dark';
      localStorage.setItem('theme', document.body.dataset.theme);
      this.updateThemeIcon(!isDark);
      
      // Reset animation
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 200);
    }, 100);
  }

  updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.textContent = isDark ? '🌞' : '🌙';
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  }

  // PWA Installation Management
  initPWA() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallPrompts();
      this.showToast('App installed successfully! 🎉');
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      this.hideInstallPrompts();
    }
  }

  showInstallBanner() {
    if (this.isInstalled || localStorage.getItem('install-banner-dismissed')) {
      return;
    }

    const banner = document.getElementById('install-banner');
    const closeBtn = document.getElementById('install-banner-close');
    const installBtn = document.getElementById('install-banner-btn');

    banner.classList.remove('hidden');

    closeBtn.addEventListener('click', () => {
      this.hideInstallBanner();
      localStorage.setItem('install-banner-dismissed', 'true');
    });

    installBtn.addEventListener('click', () => {
      this.installApp();
    });
  }

  hideInstallBanner() {
    const banner = document.getElementById('install-banner');
    banner.classList.add('hidden');
  }

  initInstallPrompt() {
    const installBtn = document.getElementById('install-btn');
    
    if (this.isInstalled) {
      installBtn.style.display = 'none';
      return;
    }

    installBtn.addEventListener('click', () => {
      this.installApp();
    });
  }

  async installApp() {
    if (!this.deferredPrompt) {
      this.showToast('Installation not available on this device');
      return;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.showToast('Installing app...');
      } else {
        this.showToast('Installation cancelled');
      }
      
      this.deferredPrompt = null;
    } catch (error) {
      console.error('Installation failed:', error);
      this.showToast('Installation failed');
    }
  }

  hideInstallPrompts() {
    this.hideInstallBanner();
    const installSection = document.getElementById('install-section');
    if (installSection) {
      installSection.style.display = 'none';
    }
  }

  checkInstallStatus() {
    // Check if running as PWA
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      this.hideInstallPrompts();
    }
  }

  // Calculator Logic
  initCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const inputs = document.querySelectorAll('input[type="number"]');
    
    calculateBtn.addEventListener('click', () => {
      this.calculateAttendance();
    });

    // Add input validation and enter key support
    inputs.forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.calculateAttendance();
        }
      });

      input.addEventListener('input', () => {
        this.clearValidationErrors();
      });
    });
  }

  async calculateAttendance() {
    const calculateBtn = document.getElementById('calculate-btn');
    const btnText = calculateBtn.querySelector('.btn-text');
    const btnLoader = calculateBtn.querySelector('.btn-loader');
    const resultContainer = document.getElementById('result');
    
    // Show loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    calculateBtn.disabled = true;

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    try {
      // Simulate calculation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const result = this.performCalculation();
      this.displayResult(result);
      
    } catch (error) {
      this.showError('Calculation failed. Please check your inputs.');
    } finally {
      // Reset button state
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      calculateBtn.disabled = false;
    }
  }

  performCalculation() {
    const totalClasses = parseInt(document.getElementById('total-classes').value);
    const missedClasses = parseInt(document.getElementById('missed-classes').value);
    const extraClasses = parseInt(document.getElementById('extra-classes').value) || 0;
    const threshold = parseFloat(document.getElementById('threshold').value);
    const countExtraInTotal = document.getElementById('extra-classes-toggle').checked;

    // Validation
    if (!totalClasses || totalClasses <= 0) {
      throw new Error('Please enter a valid number of total classes');
    }
    if (missedClasses < 0 || missedClasses > totalClasses) {
      throw new Error('Missed classes cannot be negative or greater than total classes');
    }
    if (!threshold || threshold <= 0 || threshold > 100) {
      throw new Error('Please enter a valid threshold percentage (1-100)');
    }

    let attendedClasses = totalClasses - missedClasses;
    let totalForCalculation;

    if (countExtraInTotal) {
      // Extra classes reduce the total requirement
      totalForCalculation = totalClasses + extraClasses;
      attendedClasses = totalClasses - missedClasses;
    } else {
      // Extra classes add to attendance
      totalForCalculation = totalClasses;
      attendedClasses = totalClasses - missedClasses + extraClasses;
    }

    const currentAttendance = (attendedClasses / totalForCalculation) * 100;
    const requiredAttendance = threshold;
    const attendanceGap = requiredAttendance - currentAttendance;

    let status, message, classesNeeded = 0, maxMissable = 0;

    if (currentAttendance >= requiredAttendance) {
      status = 'success';
      // Calculate maximum classes that can be missed
      maxMissable = Math.floor((attendedClasses - (requiredAttendance * totalForCalculation / 100)) / (requiredAttendance / 100));
      message = `Great! You're meeting the attendance requirement.`;
    } else {
      status = 'warning';
      // Calculate classes needed to meet requirement
      classesNeeded = Math.ceil((requiredAttendance * totalForCalculation / 100) - attendedClasses);
      message = `You need to attend ${classesNeeded} more class${classesNeeded > 1 ? 'es' : ''} to meet the requirement.`;
    }

    return {
      status,
      message,
      currentAttendance: currentAttendance.toFixed(2),
      requiredAttendance: requiredAttendance.toFixed(1),
      classesNeeded,
      maxMissable,
      attendedClasses,
      totalForCalculation
    };
  }

  displayResult(result) {
    const resultContainer = document.getElementById('result');
    const resultContent = document.getElementById('result-content');
    
    const statusIcon = result.status === 'success' ? '✅' : '⚠️';
    const statusClass = `result-${result.status}`;
    
    resultContent.innerHTML = `
      <div class="result-item ${statusClass}">
        <div class="result-icon">${statusIcon}</div>
        <div class="result-text">
          <strong>Current Attendance: ${result.currentAttendance}%</strong>
          <span>Required: ${result.requiredAttendance}%</span>
        </div>
      </div>
      
      <div class="result-item">
        <div class="result-icon">📊</div>
        <div class="result-text">
          <strong>${result.message}</strong>
          <span>Classes attended: ${result.attendedClasses} / ${result.totalForCalculation}</span>
        </div>
      </div>
      
      ${result.status === 'success' && result.maxMissable > 0 ? `
        <div class="result-item result-success">
          <div class="result-icon">🎯</div>
          <div class="result-text">
            <strong>You can miss up to ${result.maxMissable} more class${result.maxMissable > 1 ? 'es' : ''}</strong>
            <span>And still maintain ${result.requiredAttendance}% attendance</span>
          </div>
        </div>
      ` : ''}
      
      ${result.classesNeeded > 0 ? `
        <div class="result-item result-warning">
          <div class="result-icon">📚</div>
          <div class="result-text">
            <strong>Attend ${result.classesNeeded} more class${result.classesNeeded > 1 ? 'es' : ''}</strong>
            <span>To reach ${result.requiredAttendance}% attendance</span>
          </div>
        </div>
      ` : ''}
    `;
    
    resultContainer.classList.remove('hidden');
    
    // Scroll to result smoothly
    setTimeout(() => {
      resultContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);
  }

  showError(message) {
    const resultContainer = document.getElementById('result');
    const resultContent = document.getElementById('result-content');
    
    resultContent.innerHTML = `
      <div class="result-item result-error">
        <div class="result-icon">❌</div>
        <div class="result-text">
          <strong>Error</strong>
          <span>${message}</span>
        </div>
      </div>
    `;
    
    resultContainer.classList.remove('hidden');
  }

  clearValidationErrors() {
    // Remove any existing error states
    document.querySelectorAll('input.error').forEach(input => {
      input.classList.remove('error');
    });
  }

  showToast(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: var(--md-sys-elevation-level3);
      z-index: 1000;
      font-size: 0.875rem;
      max-width: 90%;
      text-align: center;
      animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Service Worker Registration
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./service-worker.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateToast();
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  showUpdateToast() {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <span>New version available!</span>
      <button onclick="window.location.reload()" style="margin-left: 12px; padding: 4px 8px; border: none; border-radius: 4px; background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); cursor: pointer;">
        Update
      </button>
    `;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: var(--md-sys-elevation-level3);
      z-index: 1000;
      font-size: 0.875rem;
      max-width: 90%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 10000);
  }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AttendanceCalculator();
  });
} else {
  new AttendanceCalculator();
}
