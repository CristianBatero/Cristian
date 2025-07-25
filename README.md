# 🚀 Portafolio Personal - Cristian Batero

Portafolio personal desarrollado en HTML, CSS y JavaScript puro. Diseño moderno, responsive y optimizado para mostrar mis habilidades como desarrollador.

## 📋 Características

- ✅ **Diseño Responsive** - Funciona perfectamente en todos los dispositivos
- ✅ **Animaciones Suaves** - Efectos visuales elegantes con Animate.css
- ✅ **Formulario de Contacto** - Múltiples opciones de envío (EmailJS, Formspree, Netlify)
- ✅ **Proyectos Dinámicos** - Carga automática desde archivo JSON
- ✅ **Menú Móvil** - Navegación hamburguesa con animaciones
- ✅ **Optimizado SEO** - Meta tags y estructura semántica
- ✅ **Accesibilidad** - Navegación por teclado y screen readers
- ✅ **Performance** - Carga rápida y optimizada

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Librerías:** 
  - Font Awesome (iconos)
  - Animate.css (animaciones)
  - Typed.js (efecto de escritura)
- **Formularios:** EmailJS, Formspree, Netlify Forms
- **Hosting:** Compatible con Netlify, Vercel, GitHub Pages

## 📁 Estructura del Proyecto

```
portfolio/
├── index.html              # Página principal
├── css/
│   ├── style.css          # Estilos principales
│   └── responsive.css     # Estilos responsivos
├── js/
│   ├── main.js           # JavaScript principal
│   └── typing.js         # Animaciones de tipeo
├── img/
│   ├── avatar.png        # Foto de perfil
│   ├── favicon.ico       # Favicon del sitio
│   └── proyecto*.jpg     # Imágenes de proyectos
├── projects/
│   └── data.json         # Datos de proyectos
├── downloads/
│   └── cv.pdf           # Currículum para descarga
└── README.md            # Este archivo
```

## 🚀 Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/CristianBatero/portfolio.git
cd portfolio
```

### 2. Personalizar el contenido
- Edita `index.html` con tu información personal
- Reemplaza las imágenes en la carpeta `img/`
- Actualiza `projects/data.json` con tus proyectos
- Sube tu CV a `downloads/cv.pdf`

### 3. Configurar formulario de contacto

#### Opción A: EmailJS (Recomendado)
1. Registrate en [EmailJS.com](https://www.emailjs.com/)
2. Crea un servicio y template
3. Descomenta las líneas de EmailJS en `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>emailjs.init('YOUR_PUBLIC_KEY');</script>
```
4. Actualiza las credenciales en `js/main.js`:
```javascript
const serviceID = 'YOUR_SERVICE_ID';
const templateID = 'YOUR_TEMPLATE_ID';
const userID = 'YOUR_USER_ID';
```

#### Opción B: Formspree
1. Registrate en [Formspree.io](https://formspree.io/)
2. Actualiza el action del formulario:
```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

#### Opción C: Netlify Forms
1. Sube el sitio a [Netlify](https://netlify.com/)
2. El formulario funcionará automáticamente

### 4. Subir a hosting

#### GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
Ve a Settings > Pages en tu repositorio

#### Netlify
1. Arrastra la carpeta a [netlify.com/drop](https://app.netlify.com/drop)
2. O conecta tu repositorio de GitHub

#### Vercel
```bash
npx vercel --prod
```

## 📊 Configuración de Proyectos

Edita `projects/data.json` para agregar tus proyectos:

```json
{
    "titulo": "Nombre del Proyecto",
    "descripcion": "Descripción detallada del proyecto...",
    "imagen": "img/proyecto.jpg",
    "tecnologias": ["JavaScript", "React", "Node.js"],
    "demo": "https://tu-demo.com",
    "repositorio": "https://github.com/usuario/proyecto"
}
```

## 🎨 Personalización

### Colores
Modifica las variables CSS en `css/style.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --accent-color: #e74c3c;
}
```

### Animaciones
Cambia las animaciones en `js/typing.js`:
```javascript
strings: [
    'Tu Texto 1',
    'Tu Texto 2',
    'Tu Texto 3'
]
```

### Redes Sociales
Actualiza los enlaces en el footer de `index.html`.

## 📈 SEO y Analytics

### Meta Tags
Actualiza los meta tags en `<head>`:
```html
<meta name="description" content="Tu descripción">
<meta name="keywords" content="tus, palabras, clave">
<meta property="og:title" content="Tu Nombre - Portafolio">
```

### Google Analytics
Agrega tu código de tracking antes de `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🔧 Características Técnicas

### Performance
- Lazy loading de imágenes
- CSS y JS minificados
- Optimización de fuentes
- Compresión de imágenes

### Accesibilidad
- Navegación por teclado
- Alt text en imágenes
- Contraste adecuado
- Estructura semántica

### SEO
- URLs amigables
- Meta tags optimizados
- Schema markup
- Sitemap.xml

## 🐛 Resolución de Problemas

### Formulario no funciona
1. Verifica que tengas configurado un servicio (EmailJS, Formspree, etc.)
2. Revisa la consola del navegador para errores
3. Asegúrate de que los IDs coincidan

### Imágenes no cargan
1. Verifica que las rutas sean correctas
2. Usa imágenes en formato web (WebP, JPG, PNG)
3. Comprime las imágenes para mejor rendimiento

### Animaciones no funcionan
1. Verifica que Animate.css esté cargando
2. Revisa que Typed.js esté disponible
3. Comprueba errores en la consola

## 📞 Contacto

- **Email:** cristianbatero18@gmail.com
- **LinkedIn:** [Cristian Andrés](https://www.linkedin.com/in/cristian-andres-824742361/)
- **GitHub:** [CristianBatero](https://github.com/CristianBatero)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para tu propio portafolio.

## 🚀 Próximas Mejoras

- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Blog integrado
- [ ] Multi-idioma
- [ ] Filtros de proyectos
- [ ] Testimonios