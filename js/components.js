/* ============================================
   🎨 SIED - Sistema de Componentes Interactivos
   Gestión de Modals, Alerts, Theme Toggle, etc.
   ============================================ */

// ============================================
// MODO OSCURO - Theme Toggle
// ============================================
function initThemeToggle() {
    // Crear el botón de toggle si no existe
    if (!document.querySelector('.theme-toggle')) {
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = `
      <span class="theme-toggle-icon">🌙</span>
      <span class="theme-toggle-text">Modo Oscuro</span>
    `;
        document.body.appendChild(toggle);

        // Cargar preferencia guardada
        const savedTheme = localStorage.getItem('sied-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            updateThemeToggle(true);
        }

        // Event listener
        toggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('sied-theme', isDark ? 'dark' : 'light');
    updateThemeToggle(isDark);

    // Animación suave
    document.body.style.transition = 'background 0.5s ease';
}

function updateThemeToggle(isDark) {
    const toggle = document.querySelector('.theme-toggle');
    const icon = toggle.querySelector('.theme-toggle-icon');
    const text = toggle.querySelector('.theme-toggle-text');

    if (isDark) {
        icon.textContent = '☀️';
        text.textContent = 'Modo Claro';
    } else {
        icon.textContent = '🌙';
        text.textContent = 'Modo Oscuro';
    }
}

// ============================================
// SISTEMA DE ALERTAS
// ============================================
function showAlert(type, title, message, duration = 5000) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.position = 'fixed';
    alert.style.top = '100px';
    alert.style.right = '24px';
    alert.style.maxWidth = '400px';
    alert.style.zIndex = '10000';

    const icons = {
        success: '✅',
        warning: '⚠️',
        danger: '❌',
        info: 'ℹ️'
    };

    alert.innerHTML = `
    <div class="alert-title">
      <span>${icons[type] || 'ℹ️'}</span>
      ${title}
    </div>
    <div class="alert-message">${message}</div>
    <button class="alert-close" onclick="this.parentElement.remove()">×</button>
  `;

    document.body.appendChild(alert);

    // Auto-cerrar
    if (duration > 0) {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100px)';
            setTimeout(() => alert.remove(), 300);
        }, duration);
    }

    return alert;
}

// ============================================
// SISTEMA DE MODALES
// ============================================
function showModal(title, content, options = {}) {
    // Crear overlay si no existe
    let overlay = document.querySelector('.modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
    }

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal';

    const footerButtons = options.buttons || [
        { text: 'Cerrar', class: 'btn-secondary', onClick: () => closeModal() }
    ];

    const footerHTML = footerButtons.map(btn =>
        `<button class="${btn.class || 'btn-primary'}" onclick="(${btn.onClick.toString()})()">${btn.text}</button>`
    ).join('');

    modal.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      ${content}
    </div>
    <div class="modal-footer">
      ${footerHTML}
    </div>
  `;

    overlay.innerHTML = '';
    overlay.appendChild(modal);

    // Mostrar modal
    setTimeout(() => overlay.classList.add('active'), 10);

    // Cerrar al hacer click en overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Cerrar con ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    return modal;
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.innerHTML = '';
        }, 300);
    }
}

// ============================================
// SISTEMA DE CONFIRMACIÓN
// ============================================
function showConfirm(title, message, onConfirm, onCancel) {
    const content = `<p style="font-size: 1.05rem; line-height: 1.8;">${message}</p>`;

    showModal(title, content, {
        buttons: [
            {
                text: 'Cancelar',
                class: 'btn-secondary',
                onClick: () => {
                    closeModal();
                    if (onCancel) onCancel();
                }
            },
            {
                text: 'Confirmar',
                class: 'btn-primary',
                onClick: () => {
                    closeModal();
                    if (onConfirm) onConfirm();
                }
            }
        ]
    });
}

// ============================================
// LOADING SPINNER
// ============================================
function showLoading(message = 'Cargando...') {
    let spinner = document.querySelector('.spinner-overlay');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'spinner-overlay';
        spinner.innerHTML = `
      <div style="text-align: center;">
        <div class="spinner"></div>
        <p style="color: white; margin-top: 20px; font-weight: 600;">${message}</p>
      </div>
    `;
        document.body.appendChild(spinner);
    }

    setTimeout(() => spinner.classList.add('active'), 10);
    return spinner;
}

function hideLoading() {
    const spinner = document.querySelector('.spinner-overlay');
    if (spinner) {
        spinner.classList.remove('active');
        setTimeout(() => spinner.remove(), 300);
    }
}

// ============================================
// PROGRESS BAR
// ============================================
function updateProgress(elementId, percentage, label = '') {
    const container = document.getElementById(elementId);
    if (!container) return;

    const labelText = label || `${percentage}%`;

    if (!container.querySelector('.progress-bar-wrapper')) {
        container.innerHTML = `
      <div class="progress-container">
        <div class="progress-label">
          <span>${labelText}</span>
          <span class="progress-percentage">${percentage}%</span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar" style="width: 0%"></div>
        </div>
      </div>
    `;
    }

    const bar = container.querySelector('.progress-bar');
    const percentageSpan = container.querySelector('.progress-percentage');

    setTimeout(() => {
        bar.style.width = `${percentage}%`;
        percentageSpan.textContent = `${percentage}%`;
    }, 100);
}

// ============================================
// STEPS INDICATOR
// ============================================
function updateSteps(currentStep, totalSteps = 8) {
    let stepsContainer = document.querySelector('.steps-container');

    if (!stepsContainer) {
        stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps-container';

        const stepLabels = [
            'Insumos',
            'Contexto',
            'Competencias',
            'Estándares',
            'Situación',
            'Evidencias',
            'Ficha',
            'Criterios'
        ];

        for (let i = 1; i <= totalSteps; i++) {
            const step = document.createElement('div');
            step.className = 'step';
            step.innerHTML = `
        <div class="step-circle">${i}</div>
        <div class="step-label">${stepLabels[i - 1] || `Paso ${i}`}</div>
      `;
            stepsContainer.appendChild(step);
        }

        // Insertar al inicio del container
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(stepsContainer, container.firstChild);
        }
    }

    // Actualizar estado de los pasos
    const steps = stepsContainer.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
}

// ============================================
// BADGES DINÁMICOS
// ============================================
function createBadge(text, type = 'primary', icon = '') {
    const badge = document.createElement('span');
    badge.className = `badge badge-${type}`;

    if (icon) {
        badge.innerHTML = `<span class="badge-icon">${icon}</span>${text}`;
    } else {
        badge.textContent = text;
    }

    return badge;
}

// ============================================
// TOOLTIPS
// ============================================
function addTooltip(element, text) {
    const container = document.createElement('div');
    container.className = 'tooltip-container';

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;

    // Envolver el elemento
    element.parentNode.insertBefore(container, element);
    container.appendChild(element);
    container.appendChild(tooltip);
}

// ============================================
// ANIMACIONES DE ENTRADA
// ============================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .alert, .badge');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// ============================================
// VALIDACIÓN DE FORMULARIOS CON FEEDBACK
// ============================================
function validateField(input, rules) {
    const value = input.value.trim();
    let isValid = true;
    let message = '';

    if (rules.required && !value) {
        isValid = false;
        message = 'Este campo es obligatorio';
    } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        message = `Mínimo ${rules.minLength} caracteres`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        message = `Máximo ${rules.maxLength} caracteres`;
    }

    // Mostrar feedback visual
    input.style.borderColor = isValid ? '#4facfe' : '#f5576c';

    // Remover mensaje anterior
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    if (!isValid) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.style.color = '#f5576c';
        errorMsg.style.fontSize = '0.85rem';
        errorMsg.style.marginTop = '4px';
        errorMsg.textContent = message;
        input.parentElement.appendChild(errorMsg);
    }

    return isValid;
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    animateOnScroll();

    // Mensaje de bienvenida
    setTimeout(() => {
        showAlert('info', '¡Bienvenido!', 'Sistema de Evaluación Diagnóstica 2026 - Diseño Premium', 4000);
    }, 500);
});

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================
window.showAlert = showAlert;
window.showModal = showModal;
window.closeModal = closeModal;
window.showConfirm = showConfirm;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.updateProgress = updateProgress;
window.updateSteps = updateSteps;
window.createBadge = createBadge;
window.addTooltip = addTooltip;
window.validateField = validateField;
