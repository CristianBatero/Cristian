// ======================================
// MAIN JAVASCRIPT FILE - VERSIÓN CORREGIDA
// ======================================

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
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
    menuToggle.addEventListener('click', function() {
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
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
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
window.addEventListener('scroll', function() {
    if (!headerTicking) {
        requestAnimationFrame(() => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
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

// Load projects from JSON file
async function loadProjects() {
    try {
        const response = await fetch('projects/data.json');
        
        if (!response.ok) {
            createDefaultProjects();
            return;
        }
        
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.log('Projects file not found, using default projects');
        createDefaultProjects();
    }
}

// Create default projects if JSON file doesn't exist
function createDefaultProjects() {
    const defaultProjects = [
        {
            titulo: "Aplicación VPN",
            descripcion: "Desarrollo de una aplicación VPN basada en una estructura existente, implementando funcionalidades de conexión segura y gestión de usuarios.",
            imagen: "img/proyecto1.jpg",
            tecnologias: ["Java", "Networking", "Security"],
            demo: "#",
            repositorio: "https://github.com/CristianBatero"
        },
        {
            titulo: "Sistema de Gestión Web",
            descripcion: "Desarrollo de un sistema web para gestión de datos con interfaz intuitiva y funcionalidades CRUD completas.",
            imagen: "img/proyecto2.jpg",
            tecnologias: ["PHP", "MySQL", "JavaScript"],
            demo: "#",
            repositorio: "https://github.com/CristianBatero"
        },
        {
            titulo: "Automatización con Python",
            descripcion: "Scripts de automatización para tareas repetitivas en el área de infraestructura de datos, mejorando la eficiencia operativa.",
            imagen: "img/proyecto3.jpg",
            tecnologias: ["Python", "Automation", "Data Processing"],
            demo: "#",
            repositorio: "https://github.com/CristianBatero"
        }
    ];
    
    renderProjects(defaultProjects);
}

// Render projects to the DOM
function renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.imagen}" alt="${project.titulo}" onerror="this.src='https://via.placeholder.com/600x400/3498db/ffffff?text=Proyecto'">
            </div>
            <div class="project-info">
                <h3>${project.titulo}</h3>
                <p>${project.descripcion}</p>
                <div class="project-tech">
                    ${project.tecnologias.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                ${project.demo ? `<a href="${project.demo}" class="btn-demo" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Ver Demo
                </a>` : ''}
                ${project.repositorio ? `<a href="${project.repositorio}" class="btn-repo" target="_blank">
                    <i class="fab fa-github"></i> Repositorio
                </a>` : ''}
            </div>
        `;
        
        container.appendChild(projectCard);
    });
}

// ==========================================
// FORMULARIO DE CONTACTO - CORREGIDO
// ==========================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
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
    }).then(function(response) {
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
    }).catch(function(error) {
        console.error('Error:', error);
        mostrarMensaje('error', 'Error de conexión. Por favor verifica tu internet e intenta nuevamente.');
    }).finally(function() {
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
document.addEventListener('DOMContentLoaded', function() {
    const cvButton = document.querySelector('.btn-download');
    if (cvButton) {
        cvButton.addEventListener('click', function(e) {
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

// Skill bars animation (MEJORADA - sin parpadeo)
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        if (!bar.classList.contains('animated')) {
            const width = bar.style.width;
            bar.style.width = '0%';
            bar.style.transition = 'none';
            
            setTimeout(() => {
                bar.style.transition = 'width 2s ease';
                bar.style.width = width;
                bar.classList.add('animated');
            }, index * 200);
        }
    });
}

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

    const observer = new IntersectionObserver(function(entries) {
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

// Error handling for missing images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            if (this.src.includes('proyecto')) {
                this.src = 'https://via.placeholder.com/600x400/3498db/ffffff?text=Proyecto';
            } else if (this.src.includes('avatar')) {
                this.src = 'https://ui-avatars.com/api/?name=Cristian+Batero&size=300&background=3498db&color=fff';
            } else {
                this.src = 'https://via.placeholder.com/300x200/ecf0f1/333333?text=Imagen';
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
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

// Export functions for external use
window.PortfolioApp = {
    updateActiveNavLink,
    mostrarMensaje,
    animateSkillBars,
    loadProjects
};