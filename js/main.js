// ======================================
// MAIN JAVASCRIPT FILE - VERSIÓN CORREGIDA
// ======================================

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Load projects from JSON
    loadProjects();

    // Initialize animations with delay to prevent flickering
    setTimeout(() => {
        initializeAnimations();
    }, 100);
});

// Mobile menu functionality
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle && navMenu) {
    // Toggle mobile menu
    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Update active nav link on scroll (OPTIMIZADO)
let ticking = false;
function updateActiveNavLink() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
            ticking = false;
        });
        ticking = true;
    }
}

// Header background on scroll (OPTIMIZADO)
let headerTicking = false;
window.addEventListener('scroll', function () {
    if (!headerTicking) {
        requestAnimationFrame(() => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            updateActiveNavLink();
            headerTicking = false;
        });
        headerTicking = true;
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load projects from local data constant (to avoid CORS errors on file://)
function loadProjects() {
    if (typeof PROJECTS_DATA !== 'undefined') {
        renderProjects(PROJECTS_DATA);
    } else {
        console.error('PROJECTS_DATA is not defined. Ensure projects-data.js is loaded.');
    }
}

// Render projects to the DOM
function renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    container.innerHTML = '';

    // List-based "Architect's Ledger" Design
    projects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.setAttribute('data-image', project.imagen);

        const number = (index + 1).toString().padStart(2, '0');

        projectItem.innerHTML = `
            <div class="project-row">
                <div class="project-main-info">
                    <span class="project-num">${number}</span>
                    <h3 class="project-title">${project.titulo}</h3>
                    <div class="project-tags">
                        ${project.tecnologias.flatMap(t => t.split(',')).slice(0, 4).map(tech => `<span class="tag-mini">${tech.trim()}</span>`).join('')}
                    </div>
                </div>
                <div class="project-brief">
                    <p>${project.descripcion}</p>
                </div>
                <div class="project-links">
                    ${project.repositorio ? `<a href="${project.repositorio}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" title="Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>
        `;

        // Dynamic Reveal Interaction
        projectItem.addEventListener('mouseenter', (e) => {
            if (window.innerWidth > 992) {
                showProjectPreview(project.imagen, e);
            }
        });

        projectItem.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 992) {
                updateProjectPreview(e);
            }
        });

        projectItem.addEventListener('mouseleave', () => {
            hideProjectPreview();
        });

        container.appendChild(projectItem);
    });

    // Create global preview element if it doesn't exist
    if (!document.getElementById('project-preview-container')) {
        const preview = document.createElement('div');
        preview.id = 'project-preview-container';
        preview.className = 'project-preview-container';
        // Use a transparent 1x1 pixel instead of empty src to prevent error triggers
        preview.innerHTML = `<img id="project-preview-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Preview">`;
        document.body.appendChild(preview);
    }
}

// Global functions for the reveal effect
function showProjectPreview(imgSrc, event) {
    const container = document.getElementById('project-preview-container');
    const img = document.getElementById('project-preview-img');
    if (!container || !img) return;

    img.src = imgSrc;
    container.classList.add('active');
    updateProjectPreview(event);
}

function updateProjectPreview(event) {
    const container = document.getElementById('project-preview-container');
    if (!container) return;

    const x = event.clientX;
    const y = event.clientY;

    container.style.left = `${x + 20}px`;
    container.style.top = `${y + 20}px`;
}

function hideProjectPreview() {
    const container = document.getElementById('project-preview-container');
    if (container) container.classList.remove('active');
}

// ==========================================
// FORMULARIO DE CONTACTO - CORREGIDO
// ==========================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener datos del formulario
        const formData = new FormData(this);
        const nombre = formData.get('nombre');
        const email = formData.get('email');
        const mensaje = formData.get('mensaje');

        // Función de validación
        function validarEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Validación completa
        const errores = [];

        if (!nombre || nombre.trim().length < 2) {
            errores.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!email || !validarEmail(email)) {
            errores.push('Por favor ingresa un correo electrónico válido');
        }

        if (!mensaje || mensaje.trim().length < 10) {
            errores.push('El mensaje debe tener al menos 10 caracteres');
        }

        // Mostrar errores si existen
        if (errores.length > 0) {
            mostrarMensaje('error', errores.join('. '));
            return;
        }

        // Preparar el botón
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // USAR FORMSPREE (ya configurado en tu HTML)
        enviarConFormspree(this, submitBtn, originalText);
    });
}

// Implementación de Formspree (CORREGIDA)
function enviarConFormspree(form, submitBtn, originalText) {
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            mostrarMensaje('success', '¡Mensaje enviado correctamente! Te contactaré pronto.');
            form.reset();
        } else {
            return response.json().then(data => {
                if (data.errors) {
                    mostrarMensaje('error', 'Error en el formulario: ' + data.errors.map(error => error.message).join(', '));
                } else {
                    mostrarMensaje('error', 'Hubo un problema al enviar el mensaje. Por favor intenta nuevamente.');
                }
            });
        }
    }).catch(function (error) {
        console.error('Error:', error);
        mostrarMensaje('error', 'Error de conexión. Por favor verifica tu internet e intenta nuevamente.');
    }).finally(function () {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Función para mostrar mensajes
function mostrarMensaje(tipo, texto) {
    // Remover mensajes existentes
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${tipo}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${texto}</span>
            <button type="button" class="close-message" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Insertar mensaje antes del formulario
    const form = document.getElementById('contactForm');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    }

    // Auto remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// ==========================================
// DESCARGA DE CV - MEJORADA
// ==========================================

// Mejorar funcionalidad de descarga de CV
document.addEventListener('DOMContentLoaded', function () {
    const cvButton = document.querySelector('.btn-download');
    if (cvButton) {
        cvButton.addEventListener('click', function (e) {
            // Verificar si el archivo existe
            const cvPath = 'downloads/cv.pdf';

            // Crear enlace temporal para descarga
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = 'CV_Cristian_Batero.pdf';

            // Mostrar mensaje de descarga
            setTimeout(() => {
                mostrarMensajeCV('info', 'Descargando CV... Si no se descarga automáticamente, haz clic derecho y selecciona "Guardar como"');
            }, 100);

            // Agregar al DOM, hacer clic y remover
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Tracking de descarga (opcional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    event_category: 'CV',
                    event_label: 'CV_Cristian_Batero.pdf'
                });
            }
        });
    }
});

// Función para mostrar mensajes de CV
function mostrarMensajeCV(tipo, texto) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `cv-message ${tipo}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#d4edda' : tipo === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${tipo === 'success' ? '#155724' : tipo === 'error' ? '#721c24' : '#0c5460'};
        padding: 1rem;
        border-radius: 5px;
        border-left: 4px solid ${tipo === 'success' ? '#28a745' : tipo === 'error' ? '#dc3545' : '#17a2b8'};
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${texto}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
        </div>
    `;

    document.body.appendChild(messageDiv);

    // Auto remover después de 4 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 4000);
}

// Skill bars animation (MOTOR DEFINITIVO)
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach((bar, index) => {
        if (!bar.classList.contains('animated')) {
            const target = bar.getAttribute('data-target');
            if (!target) return;

            // Forzar inicio limpio
            bar.style.width = '0%';

            setTimeout(() => {
                bar.style.width = target;
                bar.classList.add('animated');
                // Efecto de resplandor extra al terminar
                bar.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.8)';
            }, (index * 150) + 200);
        }
    });
}

// Disparador de emergencia por scroll
window.addEventListener('scroll', () => {
    const skillsSection = document.getElementById('habilidades');
    if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            animateSkillBars();
        }
    }
}, { passive: true });

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize animations (VERSIÓN MEJORADA - sin parpadeo)
function initializeAnimations() {
    const animatedElements = new Set();

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            const element = entry.target;

            if (entry.isIntersecting && !animatedElements.has(element)) {
                animatedElements.add(element);

                setTimeout(() => {
                    element.classList.add('animate__animated', 'animate__fadeInUp');
                }, 100);

                if (element.id === 'habilidades') {
                    setTimeout(() => {
                        animateSkillBars();
                    }, 500);
                }

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.skill, .project-card, .timeline-item, section[id]');
    elementsToAnimate.forEach(el => {
        if (!isElementInViewport(el)) {
            observer.observe(el);
        } else {
            el.classList.add('animate__animated', 'animate__fadeInUp');
            animatedElements.add(el);

            if (el.id === 'habilidades') {
                setTimeout(() => {
                    animateSkillBars();
                }, 300);
            }
        }
    });
}

// Silent error handling for images
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function () {
            // Simply hide the broken image if no local fallback is available
            this.style.opacity = '0';
            console.warn('Image failed to load:', this.src);
        });
    });

    // Initialize special animations
    initSkillTilt();
});

// Keyboard navigation support
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        if (menuToggle && navMenu && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Console message for developers
console.log(`
🚀 Portafolio de Cristian Batero
📧 Contacto: cristianbatero18@gmail.com
🔗 GitHub: https://github.com/CristianBatero
💼 LinkedIn: https://www.linkedin.com/in/cristian-andres-824742361/

¿Interesado en colaborar? ¡Escríbeme!
`);


// Professional Animations - CSS Variables based Tilt
function initSkillTilt() {
    const cards = document.querySelectorAll('.skill-card');

    cards.forEach(card => {
        const inner = card.querySelector('.skill-card-inner');

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 992) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle tilt values
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.classList.add('is-tilted');

            // Update CSS Variables instead of inline transform
            inner.style.setProperty('--rotate-x', `${rotateX}deg`);
            inner.style.setProperty('--rotate-y', `${rotateY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-tilted');
            // Reset variables
            inner.style.setProperty('--rotate-x', '0deg');
            inner.style.setProperty('--rotate-y', '0deg');
        });

        // Mobile interaction
        card.addEventListener('click', function (e) {
            if (window.innerWidth <= 992) {
                this.classList.toggle('is-flipped-mobile');
            }
        });
    });
}

// Export functions for external use
window.PortfolioApp = {
    updateActiveNavLink,
    mostrarMensaje,
    animateSkillBars,
    loadProjects,
    initSkillTilt
};
