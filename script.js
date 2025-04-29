// Enhanced script with improved animations and Apple-style interactions
document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
  
  // Initialize all app features
  function initApp() {
    initThemeToggle();
    initAnimations();
    initCalculator();
    initPWAFeatures();
    initInteractions();
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
    
    // Apply transition class after initial load
    setTimeout(() => {
      document.body.classList.add('transitions-enabled');
    }, 300);
    
    // Toggle theme with smooth animation
    themeToggle.addEventListener('click', () => {
      // Add rotation animation
      themeToggle.style.transform = 'rotate(360deg) scale(0.8)';
      
      // Apply haptic feedback if available
      if (window.navigator && window.navigator.vibrate) {
        navigator.vibrate(5);
      }
      
      // Toggle theme with delay for animation
      setTimeout(() => {
        const isDark = document.body.dataset.theme === 'dark';
        document.body.dataset.theme = isDark ? '' : 'dark';
        localStorage.setItem('theme', document.body.dataset.theme);
        updateThemeIcon(!isDark);
        
        // Reset transform for next animation
        setTimeout(() => {
          themeToggle.style.transform = '';
        }, 300);
      }, 150);
      
      // Apply page transition effect
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = document.body.dataset.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
      overlay.style.zIndex = '9999';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(overlay);
      
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        setTimeout(() => {
          overlay.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(overlay);
          }, 300);
        }, 100);
      });
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
  
  // Enhanced page load animations
  function initAnimations() {
    // Staggered animation for input fields
    document.querySelectorAll('.input-group').forEach((group, index) => {
      group.style.animationDelay = `${index * 0.08 + 0.4}s`;
    });
    
    // Initial animations
    const header = document.querySelector('header h1');
    const container = document.querySelector('.container');
    
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    container.style.opacity = '0';
    container.style.transform = 'translateY(40px)';
    
    // Trigger animations with slight delay
    setTimeout(() => {
      header.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      header.style.opacity = '1';
      header.style.transform = 'translateY(0)';
      
      setTimeout(() => {
        container.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 200);
    }, 100);
  }
  
  // Calculate Attendance with smooth result transitions
  function initCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const extraClassesToggle = document.getElementById('extra-classes-toggle');
    
    calculateBtn.addEventListener('click', () => {
      // Add button press animation
      calculateBtn.classList.add('active');
      calculateBtn.style.transform = 'scale(0.96)';
      
      // Apply haptic feedback if available
      if (window.navigator && window.navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      setTimeout(() => {
        calculateBtn.style.transform = '';
        setTimeout(() => calculateBtn.classList.remove('active'), 200);
      }, 200);
      
      // Get input values with animation effects
      animateInput('total-classes');
      animateInput('missed-classes');
      animateInput('extra-classes');
      animateInput('threshold');
      
      const total = parseInt(document.getElementById('total-classes').value);
      const missed = parseInt(document.getElementById('missed-classes').value);
      const extra = parseInt(document.getElementById('extra-classes').value) || 0;
      const threshold = parseFloat(document.getElementById('threshold').value);
      const countExtraInTotal = extraClassesToggle.checked;
      
      // Validate inputs with smooth error indication
      if (isNaN(total) || isNaN(missed) || total <= 0 || missed < 0 || threshold <= 0) {
        showErrorAnimation();
        showResult("⚠️ Please enter valid numbers.", "warning");
        return;
      }
      
      // Calculate attendance based on extra classes settings
      // When toggle is ON: (total - missed) / (total - extra)
      // When toggle is OFF: (total - missed + extra) / total
      
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
        message += `<span class="result-action">📈 Attend at least <strong>${needed}</strong> more class(es) to reach ${threshold}%.</span>`;
        message += `</div>`;
        
        showResult(message, "warning");
      } else {
        message += `<div class="result-section success">`;
        message += `<span class="result-action">🎉 You are above the threshold!</span>`;
        message += `</div>`;
        
        showResult(message, "success");
        
        // Launch celebration confetti with enhanced effects
        launchCelebration();
      }
    });
    
    function animateInput(id) {
      const input = document.getElementById(id);
      const parent = input.parentElement;
      
      parent.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        parent.style.transform = '';
      }, 300);
    }
    
    function showErrorAnimation() {
      const container = document.querySelector('.container');
      container.style.transform = 'translateX(10px)';
      setTimeout(() => {
        container.style.transform = 'translateX(-10px)';
        setTimeout(() => {
          container.style.transform = 'translateX(5px)';
          setTimeout(() => {
            container.style.transform = 'translateX(-5px)';
            setTimeout(() => {
              container.style.transform = '';
            }, 100);
          }, 100);
        }, 100);
      }, 100);
      
      // Apply haptic feedback if available
      if (window.navigator && window.navigator.vibrate) {
        navigator.vibrate([10, 30, 10]);
      }
    }
    
    // Display result with enhanced animation
    function showResult(message, type) {
      // First hide the result if it's already shown
      resultDiv.classList.remove('show');
      
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
      // Create and append confetti container if not exists
      let confettiContainer = document.getElementById('confetti-container');
      
      if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
      }
      
      // Create confetti particles with Apple-style colors
      const colors = [
        '#0071e3', // Apple blue
        '#30d158', // Apple green
        '#ff453a', // Apple red
        '#ff9f0a', // Apple orange
        '#bf5af2'  // Apple purple
      ];
      
      // Number of confetti pieces
      const confettiCount = window.innerWidth < 600 ? 50 : 100;
      
      // Clear previous confetti
      confettiContainer.innerHTML = '';
      
      // Generate confetti pieces
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        
        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const startPositionLeft = Math.random() * 100;
        const rotationSpeed = Math.random() * 600 + 200;
        const animationDuration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        const opacity = Math.random() * 0.7 + 0.3;
        
        // Set styles
        confetti.style.position = 'absolute';
        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.opacity = opacity.toString();
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.left = `${startPositionLeft}vw`;
        confetti.style.top = '-20px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `confettiFall ${animationDuration}s ease-in forwards, confettiRotate ${rotationSpeed}ms linear infinite`;
        confetti.style.animationDelay = `${delay}s`;
        
        // Add to container
        confettiContainer.appendChild(confetti);
      }
      
      // Remove confetti after animation completes
      setTimeout(() => {
        if (confettiContainer) {
          confettiContainer.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(confettiContainer)) {
              document.body.removeChild(confettiContainer);
            }
          }, 1000);
        }
      }, 5000);
      
      // Add confetti animation keyframes if not already present
      if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
          @keyframes confettiFall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: var(--opacity); }
            80% { opacity: var(--opacity); }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          
          @keyframes confettiRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Apply haptic success feedback if available
      if (window.navigator && window.navigator.vibrate) {
        navigator.vibrate([15, 50, 20]);
      }
    }
  }
  
  // Initialize PWA features for installability
  function initPWAFeatures() {
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');
    
    // Hide install button initially
    if (installBtn) {
      installBtn.style.display = 'none';
    }
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the default prompt display
      e.preventDefault();
      // Store the event for later use
      deferredPrompt = e;
      
      // Show the install button
      if (installBtn) {
        installBtn.style.display = 'block';
        
        // Add animation to make it noticeable
        setTimeout(() => {
          installBtn.style.animation = 'pulse 1.5s ease-in-out infinite';
        }, 3000);
      }
    });
    
    // Handle install button click
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        // Button press animation
        installBtn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          installBtn.style.transform = '';
        }, 200);
        
        // If no installation prompt available
        if (!deferredPrompt) {
          // Show helper message for iOS users
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          
          if (isIOS) {
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
              showResult(`
                <div class="result-section">
                  <span class="result-title">Install on iOS</span>
                  <span class="result-action">Tap the share icon ⬆️ and then "Add to Home Screen" to install this app.</span>
                </div>
              `, "");
            }
          }
          return;
        }
        
        // Show the installation prompt
        deferredPrompt.prompt();
        
        // Wait for user choice
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            // Hide the button after successful installation
            installBtn.style.display = 'none';
            
            // Show success message
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
              showResult(`
                <div class="result-section success">
                  <span class="result-action">🎉 App installed successfully!</span>
                </div>
              `, "success");
            }
          }
          
          // Clear the prompt reference
          deferredPrompt = null;
        });
      });
    }
    
    // Helper function to show result
    function showResult(message, type) {
      const resultDiv = document.getElementById('result');
      if (!resultDiv) return;
      
      resultDiv.classList.remove('show');
      
      setTimeout(() => {
        resultDiv.innerHTML = message;
        resultDiv.className = type;
        resultDiv.classList.add('show');
      }, 300);
    }
  }
  
  // Initialize additional Apple-style interactions
  function initInteractions() {
    // Add subtle hover effects to input fields
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {  // Only on larger devices
          input.style.transform = 'translateY(-2px)';
          input.style.boxShadow = '0 4px 12px var(--shadow)';
        }
      });
      
      input.addEventListener('mouseleave', () => {
        input.style.transform = '';
        input.style.boxShadow = '';
      });
    });
    
    // Add focus animations to input groups
    document.querySelectorAll('.input-group').forEach(group => {
      const input = group.querySelector('input');
      const label = group.querySelector('label');
      
      if (input && label) {
        input.addEventListener('focus', () => {
          group.classList.add('focused');
          label.style.color = 'var(--accent)';
          label.style.transform = 'translateY(-3px)';
        });
        
        input.addEventListener('blur', () => {
          group.classList.remove('focused');
          label.style.color = '';
          label.style.transform = '';
        });
      }
    });
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Add subtle parallax effect
    if (window.innerWidth > 768) {
      window.addEventListener('mousemove', (e) => {
        const container = document.querySelector('.container');
        const header = document.querySelector('header h1');
        
        if (container && header) {
          const mouseX = e.clientX / window.innerWidth - 0.5;
          const mouseY = e.clientY / window.innerHeight - 0.5;
          
          container.style.transform = `translateX(${mouseX * 8}px) translateY(${mouseY * 8}px)`;
          header.style.transform = `translateX(${mouseX * 15}px) translateY(${mouseY * 15}px)`;
        }
      });
    }
    
    // Add auto hide tooltip after showing for a few seconds
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      setTimeout(() => {
        tooltip.style.opacity = '0';
      }, 5000);
    }
    
    // Handle adaptive animations based on device power
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      // Simplify animations for users who prefer reduced motion
      document.body.classList.add('reduced-motion');
    }
  }