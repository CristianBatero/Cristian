<?php
// contact.php - Procesamiento del formulario de contacto
// Iniciar sesión
session_start();

// Función para limpiar datos
function limpiarDatos($datos) {
    $datos = trim($datos);
    $datos = stripslashes($datos);
    $datos = htmlspecialchars($datos);
    return $datos;
}

// Verificar si el campo honeypot está vacío (protección contra bots)
if (!empty($_POST['honeypot'])) {
    // Si el campo honeypot tiene contenido, es probablemente un bot
    header('Location: ../index.php#contacto');
    exit;
}

// Verificar si se envió el formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener y limpiar los datos
    $nombre = isset($_POST['nombre']) ? limpiarDatos($_POST['nombre']) : '';
    $email = isset($_POST['email']) ? limpiarDatos($_POST['email']) : '';
    $mensaje = isset($_POST['mensaje']) ? limpiarDatos($_POST['mensaje']) : '';
    
    // Validar los datos
    $errores = [];
    
    if (empty($nombre)) {
        $errores[] = 'El nombre es obligatorio';
    }
    
    if (empty($email)) {
        $errores[] = 'El correo electrónico es obligatorio';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = 'El correo electrónico no es válido';
    }
    
    if (empty($mensaje)) {
        $errores[] = 'El mensaje es obligatorio';
    }
    
    // Si no hay errores, procesar el formulario
    if (empty($errores)) {
        // Configurar el correo
        $destinatario = 'tucorreo@ejemplo.com'; // Cambia esto por tu correo real
        $asunto = 'Nuevo mensaje desde tu portafolio';
        
        // Cabeceras del correo
        $cabeceras = "MIME-Version: 1.0" . "\r\n";
        $cabeceras .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $cabeceras .= "From: $nombre <$email>" . "\r\n";
        
        // Contenido del correo
        $contenido = "
        <html>
        <head>
            <title>Nuevo mensaje desde tu portafolio</title>
        </head>
        <body>
            <h2>Has recibido un nuevo mensaje</h2>
            <p><strong>Nombre:</strong> $nombre</p>
            <p><strong>Correo:</strong> $email</p>
            <p><strong>Mensaje:</strong></p>
            <p>" . nl2br($mensaje) . "</p>
        </body>
        </html>
        ";
        
        // Intentar enviar el correo
        if (mail($destinatario, $asunto, $contenido, $cabeceras)) {
            // Éxito - Crear mensaje de éxito
            $_SESSION['mensaje'] = [
                'tipo' => 'success',
                'texto' => '¡Mensaje enviado con éxito! Te responderé lo antes posible.'
            ];
        } else {
            // Error - Crear mensaje de error
            $_SESSION['mensaje'] = [
                'tipo' => 'error',
                'texto' => 'Hubo un problema al enviar el mensaje. Por favor intenta nuevamente.'
            ];
        }
    } else {
        // Hay errores - Crear mensaje de error
        $_SESSION['mensaje'] = [
            'tipo' => 'error',
            'texto' => 'Por favor completa todos los campos correctamente.'
        ];
    }
    
    // Redirigir de vuelta al formulario
    header('Location: ../index.php#contacto');
    exit;
} else {
    // Si alguien intenta acceder directamente, redirigir al inicio
    header('Location: ../index.php');
    exit;
}
?>