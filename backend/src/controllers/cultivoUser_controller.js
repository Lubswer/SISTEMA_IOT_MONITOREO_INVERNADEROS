import { sendMailToOwner } from '../helpers/sendMail.js'
import { subirImagenCloudinary, subirBase64Cloudinary } from '../helpers/uploadCloudinary.js';
import cultivoUser from '../models/cultivoUser.js'
import mongoose from 'mongoose';
import { crearTokenJWT } from '../middleware/JWT.js';
import Tratamiento from "../models/tratamientoCultivo.js"
import userApp from '../models/userApp.js';

const registrarCultivo = async (req, res) => {
    try {
        //paso1
        const { nombreCultivo, tipoPlanta } = req.body
        if (!nombreCultivo || !tipoPlanta) {
            return res.status(400).json({ msg: "Por favor completa el nombre y tipo del cultivo" })
        }

        // Paso 2: Verificar si el nombre del cultivo ya existe para este usuario
        const cultivoExiste = await cultivoUser.findOne({ 
            nombreCultivo: nombreCultivo.trim(),
            usuario: req.userAppHeader._id 
        })

        if (cultivoExiste) {
            return res.status(400).json({ msg: "Ya tienes un cultivo registrado con ese nombre" })
        }

        const password = Math.random().toString(36).substring(2, 8).toUpperCase()

        const nuevoCultivo = new cultivoUser({
            ...req.body,
            usuario: req.userAppHeader._id
        })
        nuevoCultivo.passwordPropietario = await nuevoCultivo.encryptPassword(password)

        if (req.files?.imagen) {
            const { secure_url, public_id } = await subirImagenCloudinary(req.files.imagen.tempFilePath)
            nuevoCultivo.avatarCultivo = secure_url
            nuevoCultivo.avatarCultivoID = public_id
        }
        if (req.body?.avatarCultivo) {
            const { secure_url } = await subirBase64Cloudinary(req.body.avatarCultivo)
            nuevoCultivo.avatarCultivo = secure_url
        }

        // Guardar cultivo en BDD
        await nuevoCultivo.save()

        // Intentar enviar correo con la clave de acceso
        try {
            const user = await userApp.findById(req.userAppHeader._id)
            const correoDestino = user?.email || req.body?.emailPropietario
            if (correoDestino) {
                console.log(`📧 Enviando correo con la clave [${password}] a ${correoDestino}...`)
                await sendMailToOwner(correoDestino, password, user?.nombre || 'Cultivador')
            } else {
                console.log("⚠️ No se encontró email para enviar la clave de acceso del cultivo.")
            }
        } catch (mailErr) {
            console.error("Aviso: No se pudo enviar el correo pero el cultivo fue registrado:", mailErr)
        }

        res.status(200).json({ 
            msg: `Cultivo registrado exitosamente. Tu clave de acceso enviada al correo es: ${password}`,
            claveAcceso: password
        })

    } catch (error) {
        console.error("Error en registrarCultivo:", error)
        res.status(500).json({ msg: `Error al registrar el cultivo: ${error.message}` })
    }

}

const listarCultivos = async (req, res) => {
    try {
        const userId = req.userAppHeader?._id
        const filtro = userId ? { usuario: userId } : {}
        const cultivos = await cultivoUser.find(filtro).select("-passwordPropietario -__v -createdAt -updatedAt").populate("usuario", "nombre")

        res.status(200).json(cultivos)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error al listar los cultivos" })
    }
}


const detalleCultivo = async (req, res) => {
    try {
        // Paso 1 — Obtener el id del cultivo desde la URL
        const { id } = req.params

        // Paso 2 — Validar que el id sea un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        const cultivoBDD = await cultivoUser.findById(id).populate("usuario", "nombre email").populate("tratamientos")
        if (!cultivoBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        const tratamientosBDD = await Tratamiento.find({ cultivoUser: id })
        const cultivoObj = cultivoBDD.toObject()

        // Asignar array de tratamientos
        cultivoObj.tratamientos = tratamientosBDD.length > 0 ? tratamientosBDD : (cultivoObj.tratamientos || [])

        // Si existen tratamientos, mapear los valores mas recientes de nivelhumedad, nivelRiego y nivelLuz
        if (cultivoObj.tratamientos.length > 0) {
            const ultimoTratamiento = cultivoObj.tratamientos[cultivoObj.tratamientos.length - 1]
            cultivoObj.nivelhumedad = ultimoTratamiento.nivelhumedad || cultivoObj.nivelhumedad || null
            cultivoObj.nivelRiego = ultimoTratamiento.nivelRiego || cultivoObj.nivelRiego || null
            cultivoObj.nivelLuz = ultimoTratamiento.nivelLuz || cultivoObj.nivelLuz || null
        }

        res.status(200).json(cultivoObj)

    } catch (error) {
        console.error("Error al obtener detalle del cultivo:", error)
        res.status(500).json({ msg: "Error al obtener el cultivo" })
    }
}

const actualizarCultivo = async (req, res) => {
    try {
        const { id } = req.params
        const { nombreCultivo, tipoPlanta, cantidad, detalleCultivo } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        if (!nombreCultivo || !tipoPlanta) {
            return res.status(400).json({ msg: "El nombre y el tipo de planta son obligatorios" })
        }

        const cultivoBDD = await cultivoUser.findById(id)
        if (!cultivoBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        cultivoBDD.nombreCultivo = nombreCultivo.trim()
        cultivoBDD.tipoPlanta = tipoPlanta.trim()
        if (cantidad !== undefined) cultivoBDD.cantidad = cantidad
        if (detalleCultivo !== undefined) cultivoBDD.detalleCultivo = detalleCultivo.trim()

        await cultivoBDD.save()

        res.status(200).json({
            msg: "Cultivo actualizado correctamente",
            cultivo: cultivoBDD
        })

    } catch (error) {
        console.error("Error al actualizar cultivo:", error)
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const eliminarCultivo = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }
        const cultivoEliminado = await cultivoUser.findByIdAndUpdate(
            id, 
            { estadoCultivo: false, fechaSalidaCultivo: new Date() },
            { new: true }
        )
        if (!cultivoEliminado) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        res.status(200).json({ msg: "Cultivo dado de salida / eliminado correctamente", cultivo: cultivoEliminado })
    } catch (error) {
        console.error("Error al eliminar cultivo:", error)
        res.status(500).json({ msg: "Error al eliminar el cultivo" })
    }
}


const login = async (req, res) => {
    try {
        const { password: passwordPropietario, nombre: nombreCultivo } = req.body
        if (Object.values(req.body).includes("") || !passwordPropietario || !nombreCultivo) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos del formulario" })
        }
        const cultivoDB = await cultivoUser.findOne({ nombreCultivo }).select("-__v -createdAt -updatedAt")
        if (!cultivoDB) {
            return res.status(400).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        const passDB = await cultivoDB.matchPassword(passwordPropietario)
        if (!passDB) {
            return res.status(400).json({ msg: "Lo sentimos, la contraseña es incorrecta" })
        }
        const token = crearTokenJWT(cultivoDB._id, cultivoDB.rol)
        cultivoDB.estadoCultivo = true
        await cultivoDB.save()
        const { _id, estadoCultivo } = cultivoDB
        res.status(200).json({
            token,
            estadoCultivo,
            _id
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    try {
        const { passwordPropietario, token, __v, ...datosPerfil } = req.cultivoHeader
        res.status(200).json(datosPerfil)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al obtener el perfil" })
    }
}

const verificarClaveCultivo = async (req, res) => {
    try {
        const { id } = req.params
        const { passwordPropietario } = req.body

        if (!passwordPropietario) {
            return res.status(400).json({ msg: "Ingresa la clave de acceso para continuar" })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        const cultivoBDD = await cultivoUser.findById(id)
        if (!cultivoBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el cultivo no existe" })
        }

        // Comparar clave ingresada con la clave encriptada en la BDD
        const esValida = await cultivoBDD.matchPassword(passwordPropietario)
        if (!esValida) {
            return res.status(400).json({ msg: "La clave de acceso ingresada es incorrecta" })
        }

        // Si es correcta, actualizar estadoCultivo a true
        cultivoBDD.estadoCultivo = true
        await cultivoBDD.save()

        res.status(200).json({
            msg: "Clave de acceso verificada correctamente. Tu cultivo ha sido activado.",
            cultivo: cultivoBDD
        })
    } catch (error) {
        console.error("Error al verificar clave del cultivo:", error)
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

export {
    registrarCultivo,
    listarCultivos,
    detalleCultivo,
    actualizarCultivo,
    eliminarCultivo,
    login,
    perfil,
    verificarClaveCultivo
}
