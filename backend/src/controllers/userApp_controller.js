import userApp from "../models/userApp.js";
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js";
import { crearTokenJWT } from "../middleware/JWT.js"
import { subirImagenCloudinary, subirBase64Cloudinary } from '../helpers/uploadCloudinary.js';
import mongoose from "mongoose"

const registro = async (req, res) => {
    try {
        const { email, password, nombre, apellido, celular } = req.body;
        if (Object.values(req.body).includes("") || !email || !password || !nombre || !apellido) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos requeridos" })
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "El formato del correo electrónico no es válido" })
        }

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(nombre) || !nameRegex.test(apellido)) {
            return res.status(400).json({ msg: "El nombre y apellido solo pueden contener letras" })
        }
        if (celular.length !== 10) {

            return res.status(400).json({ msg: "El número de celular debe contener exáctamente 10 dígitos" })
        }
        if (password.length < 8) {
            return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" })
        }


        const verificarEmailBDD = await userApp.findOne({ email });

        if (verificarEmailBDD) {
            return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" })
        }
        const nuevoUserApp = new userApp(req.body)
        nuevoUserApp.password = await nuevoUserApp.encryptPassword(password)

        if (req.files?.imagen || req.files?.avatar) {
            const file = req.files.imagen || req.files.avatar
            const { secure_url, public_id } = await subirImagenCloudinary(file.tempFilePath, "Usuarios")
            nuevoUserApp.avatar = secure_url
            nuevoUserApp.avatarID = public_id
        } else if (req.body?.avatar) {
            const { secure_url } = await subirBase64Cloudinary(req.body.avatar, "Usuarios")
            nuevoUserApp.avatar = secure_url
        }

        const token = nuevoUserApp.createToken();
        await sendMailToRegister(email, token);
        await nuevoUserApp.save();
        res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" })

    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error}` });
    }
}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params
        const userAppBDD = await userApp.findOne({ token })
        if (!userAppBDD) {
            return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        }
        userAppBDD.token = null
        userAppBDD.confirmEmail = true
        await userAppBDD.save();

        res.status(200).json({ msg: "Cuenta confirmada, ya puedes inciar sesión" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

const recuperarPassword = async (req, res) => {

    try {
        // Paso 1
        const { email } = req.body
        // Paso 2
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const userAppBDD = await userApp.findOne({ email })
        if (!userAppBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        // Paso 3
        const token = userAppBDD.createToken()
        userAppBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await userAppBDD.save()
        // Paso 4
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}



const comprobarTokenPasword = async (req, res) => {
    try {
        // Paso 1
        const { token } = req.params
        // Paso 2
        const userAppBDD = await userApp.findOne({ token })
        if (userAppBDD?.token !== token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
        // Paso 3

        // Paso 4
        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}



const crearNuevoPassword = async (req, res) => {

    try {
        // Paso 1
        const { password, confirmpassword } = req.body
        const { token } = req.params
        // Paso 2
        if (Object.values(req.body).includes("") || !password || !confirmpassword) return res.status(404).json({ msg: "Debes llenar todos los campos" })
        if (password !== confirmpassword) return res.status(404).json({ msg: "Los passwords no coinciden" })
        const userAppBDD = await userApp.findOne({ token })
        if (!userAppBDD) return res.status(404).json({ msg: "No se puede validar la cuenta" })
        // Paso 3
        userAppBDD.token = null
        userAppBDD.password = await userAppBDD.encryptPassword(password)
        await userAppBDD.save()
        // Paso 4
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const login = async (req, res) => {

    try {
        // Paso 1
        const { email, password } = req.body
        // Paso 2
        if (Object.values(req.body).includes("") || !email || !password) return res.status(404).json({ msg: "Debes llenar todos los campos" })

        const userAppBDD = await userApp.findOne({ email }).select("-status -__v -token -updatedAt -createdAt")

        if (!userAppBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })

        if (!userAppBDD.confirmEmail) return res.status(403).json({ msg: "Debes verificar tu cuenta antes de iniciar sesión" })
        const verificarPassword = await userAppBDD.matchPassword(password)
        if (!verificarPassword) return res.status(401).json({ msg: "El password no es correcto" })
        // Paso 3
        const { nombre, apellido, direccion, celular, _id, rol } = userAppBDD
        const token = crearTokenJWT(userAppBDD._id, userAppBDD.rol)

        // Paso 4
        res.status(200).json({
            msg: "Inicio de sesión exitoso",
            token,
            rol,
            nombre,
            apellido,
            direccion,
            celular,
            _id,
            email: userAppBDD.email
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const perfil = (req, res) => {
    const usuarioInfo = req.userAppHeader || req.adminHeader || {}
    const { token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil } = usuarioInfo
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {

    try {
        const { id } = req.params
        const { nombre, apellido, direccion, celular } = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: `ID inválido: ${id}` })
        const userAppBDD = await userApp.findById(id)
        if (!userAppBDD) return res.status(404).json({ msg: `No existe el Usuario con ID ${id}` })
        if (Object.values(req.body).includes("") || !nombre || !apellido) return res.status(400).json({ msg: "Debes llenar todos los campos requeridos" })


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(nombre) || !nameRegex.test(apellido)) {
            return res.status(400).json({ msg: "El nombre y apellido solo pueden contener letras" })
        }
        if (celular.length !== 10) {

            return res.status(400).json({ msg: "El número de celular debe contener exáctamente 10 dígitos" })
        }


        userAppBDD.nombre = nombre ?? userAppBDD.nombre
        userAppBDD.apellido = apellido ?? userAppBDD.apellido
        userAppBDD.direccion = direccion ?? userAppBDD.direccion
        userAppBDD.celular = celular ?? userAppBDD.celular

        if (req.files?.imagen || req.files?.avatar) {
            const file = req.files.imagen || req.files.avatar
            const { secure_url, public_id } = await subirImagenCloudinary(file.tempFilePath, "Usuarios")
            userAppBDD.avatar = secure_url
            userAppBDD.avatarID = public_id
        } else if (req.body?.avatar) {
            const { secure_url } = await subirBase64Cloudinary(req.body.avatar, "Usuarios")
            userAppBDD.avatar = secure_url
        }

        await userAppBDD.save()
        res.status(200).json(userAppBDD)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarPassword = async (req, res) => {
    try {

        const { id } = req.params
        const { passwordActual, confirmPassword, repeatComfirmPassword } = req.body

        if (Object.values(req.body).includes("") || !passwordActual || !confirmPassword || !repeatComfirmPassword) return res.status(404).json({ msg: "Debe de llenar todos los campos" })
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "El id no es valido" })
        const userAppBDD = await userApp.findById(id)
        if (!userAppBDD) return res.status(404).json({ msg: `No existe el usuario con ID ${id}` })
        if (confirmPassword.length < 8) {
            return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" })
        }
        const verificarPassword = await userAppBDD.matchPassword(passwordActual)
        if (!verificarPassword) return res.status(404).json({ msg: `Lo sentimos, el password actual no es el correcto` })
        if (confirmPassword !== repeatComfirmPassword) return res.status(404).json({ msg: `Los password no coinciden` })
        userAppBDD.password = await userAppBDD.encryptPassword(confirmPassword)
        await userAppBDD.save()
        res.status(200).json({ msg: `Password Actualizado Correctamente` })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error} ` })
    }
}


const registrarActividad = async (req, res) => {
    try {
        const { nombreActividad, nombreCultivo, fecha, hora, estado, descripcion } = req.body

        if (!nombreActividad || !nombreCultivo || !fecha || !hora) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos requeridos (nombreActividad, nombreCultivo, fecha, hora)" })
        }

        const userAppBDD = await userApp.findById(req.userAppHeader._id)
        if (!userAppBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }

        const nuevaActividad = {
            _id: new mongoose.Types.ObjectId(),
            nombreActividad,
            nombreCultivo,
            fecha,
            hora,
            estado: estado || "Pendiente",
            descripcion: descripcion || ""
        }

        userAppBDD.actividades.push(nuevaActividad)
        await userAppBDD.save()

        res.status(201).json({
            msg: "Actividad registrada exitosamente",
            actividad: nuevaActividad
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}

const actualizarEstadoActividad = async (req, res) => {
    try {
        const { idActividad, estado } = req.body

        if (!idActividad || !estado) {
            return res.status(400).json({ msg: "Debes proporcionar el id de la actividad y el nuevo estado" })
        }

        const userAppBDD = await userApp.findById(req.userAppHeader._id)
        if (!userAppBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }

        let encontrada = false
        userAppBDD.actividades = (userAppBDD.actividades || []).map(act => {
            if (act._id?.toString() === idActividad.toString()) {
                encontrada = true
                return { ...act, estado }
            }
            return act
        })

        if (!encontrada) {
            return res.status(404).json({ msg: "Actividad no encontrada" })
        }

        userAppBDD.markModified("actividades")
        await userAppBDD.save()

        res.status(200).json({
            msg: `Estado de la actividad actualizado a "${estado}"`,
            actividades: userAppBDD.actividades
        })

    } catch (error) {
        console.error("Error al actualizar estado de actividad:", error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}


export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword,
    registrarActividad,
    actualizarEstadoActividad
}