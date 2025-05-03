// Estos son los inputs de la ventana de crear una cuenta
const nombreUsuario = document.getElementById('nombre');
const correoUsuario = document.getElementById('correo');
const contraseñaUsuario = document.getElementById('contraseña');
const botonCrear = document.getElementById('botoncrearCuenta');

// Inputs que se encuentran en la ventana login
const correo = document.getElementById('logincorreo');
const contraseña = document.getElementById('logincontraseña');

// Botones de la ventana del login
const botonIniciarseccion = document.getElementById('botoniniciarlogin');
const botonCrearCuentaLogin = document.getElementById('botoncrearlogin');

// Secciones de la interfaz
const seccionLogin = document.getElementById('seccionLogin');
const seccionCrearCuenta = document.getElementById('seccionCrearCuenta');
const secccionContenedorPrincipal = document.getElementById('contenedorPrincipal');

let usuario = {};


window.addEventListener('load', iniciar)

function iniciar() {
    iniciarServidor();

    botonCrearCuentaLogin.addEventListener('click', function () {
        seccionCrearCuenta.classList.remove('noMostrar');
        seccionLogin.classList.add('noMostrar');
    });

    botonCrear.addEventListener('click', function () {
        const valornombre = nombreUsuario.value;
        const valorcorreo = correoUsuario.value;
        const valorcontraseña = contraseñaUsuario.value;

        if (valornombre && valorcorreo && valorcontraseña) {
            registrar(valornombre, valorcorreo, valorcontraseña);
        } else {
            alert('Todos los campos son obligatorios');
        }
    });

    botonIniciarseccion.addEventListener('click', function () {
        const inputCorreo = correo.value;
        const inputContraseña = contraseña.value;

        if (inputCorreo && inputContraseña) {
            iniciarSesion(inputCorreo, inputContraseña);
        } else {
            alert('Debe llenar todos los datos');
        }
    });
}

function iniciarServidor() {
    fetch('http://localhost:3000/iniciar')
        .then(solicitud => {
            if (!solicitud.ok) {
                alert("Error al conectarse con el servidor")
            }
            return solicitud.text()
        })
        .then(datos => {
            console.log(datos)
        })
}

function iniciarSesion(correoUsuario, contraseñaUsuario) {

    fetch('http://localhost:3000/iniciarSesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            correo: correoUsuario,
            clave: contraseñaUsuario
        })
    })
        .then(solicitud => {
            if (solicitud.ok) {
                solicitud.json()
                    .then(datos => {
                        alert(datos.respuesta)
                        if (datos.respuesta == "Iniciando sesion") {
                            secccionContenedorPrincipal.classList.remove('noMostrar')
                            seccionLogin.classList.add('noMostrar')
                        }
                    })
            } else {
                alert("Error a la hora de conectarse con el servidor, para iniciar sesion")
            }
        })
}

function registrar(nombreUsuario, correoUsuario, clave) {

    fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, body:
            JSON.stringify({
                nombre: nombreUsuario,
                correo: correoUsuario,
                contraseña: clave
            })
    })

        .then(solicitud => {
            if (!solicitud.ok) {
                alert("Error al conectarse con el servidor")
            }
            return solicitud.json()
        })

        .then(datos => {
            alert(datos.respuesta)
            if (datos.respuesta == "Usuario creado con exito") {
                seccionLogin.classList.remove('noMostrar')
                seccionCrearCuenta.classList.add('noMostrar')
            }
        })
}

