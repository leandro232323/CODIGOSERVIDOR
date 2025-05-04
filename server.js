const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 3000

let BaseDatos = []
let vectorComparacion = ['g', 'm', 'a', 'i', 'l', '.', 'c', 'o', 'm']
let usuario = {}

app.get('/iniciar', (req, res) => {
    res.send("El servidor esta funcionando corretamente")
})

//Cristian


app.post('/registrar', async (req, res) => {
    let nombreUsuario = req.body.nombre
    let correoUsuario = req.body.correo
    let resultado = ""

    if (formatoCorreo(correoUsuario)) {

        let clave = req.body.contraseña
        let usuarioExistente = BaseDatos.find(user => correoUsuario === user.correo)

        if (usuarioExistente == undefined) {
            let numeroIteraciones = 10
            let hash = await bcrypt.hash(clave, numeroIteraciones)

            usuario = {
                nombre: nombreUsuario,
                correo: correoUsuario,
                contraseña: hash
            }

            BaseDatos.push(usuario)
            debugin()
            resultado = "Usuario creado con exito"

        } else {
            resultado = "Usuario EXISTENTE, (ya ahi otra cuenta con este mismo correo)"
        }

    } else {
        resultado = "el formato del correo es incorrecto, debe ser: (ejemplo@gmail.com)"
    }

    res.json({
        respuesta: resultado
    })
})

app.post('/iniciarSesion', async (req, res) => {

    let Usuario = req.body.correo
    let claveUsuario = req.body.clave
    let resultado = ""
    let existente = BaseDatos.find(user => user.correo === Usuario)

    if (existente === undefined) {
        resultado = "No se encuentra registrado el usuario"
    } else {
        let contraseñaVerificada = await bcrypt.compare(claveUsuario, existente.contraseña)

        if (contraseñaVerificada) {
            resultado = "Iniciando sesion"
        } else {
            resultado = "Credenciales incorrectas"
        }
    }
    res.json({
        respuesta: resultado
    })
})


app.listen(PORT, () => {
    console.log(`el servidor esta corriendo en http://localhost:${PORT}`)
})

app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor listo en http://181.234.87.110:3000");
});


function formatoCorreo(correo) {
    let posicionArroba = 0
    let dominio = []
    let cont = 0

    for (let x = 0; x < correo.length; x++) {
        if (correo[x] == '@') {
            posicionArroba = x
            break
        }
    }

    if (posicionArroba != 0) {
        posicionArroba = posicionArroba + 1

        while (posicionArroba != correo.length) {
            dominio[cont] = correo[posicionArroba]
            posicionArroba++
            cont++
        }

        let verificar = false

        if (dominio.length == vectorComparacion.length) {
            for (let x = 0; x < dominio.length; x++) {
                if (dominio[x] == vectorComparacion[x]) {
                    verificar = true
                } else {
                    verificar = false
                    break
                }
            }
            if (verificar) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

function debugin() {
    console.log("")
    console.log("Usuario registrados hasta el momento")
    for (let x = 0; x < BaseDatos.length; x++) {
        console.log("USUARIO -----> nombre: " + BaseDatos[x].nombre + " || correo: " + BaseDatos[x].correo + " || clave: " + BaseDatos[x].contraseña)
    }
}