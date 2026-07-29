import Admin from "../models/admin.js";
import userApp from "../models/userApp.js";
import { crearTokenJWT } from "../middleware/JWT.js";

// Registro de un Administrador
const registro = async (req, res) => {
    try {
        const { email, password, nombre } = req.body
        if (Object.values(req.body).includes("") || !email || !password || !nombre) {
            return res.status(400).json({ msg: "Debes llenar todos los campos requeridos" })
        }

        const emailExistente = await Admin.findOne({ email })
        if (emailExistente) {
            return res.status(400).json({ msg: "El correo electrónico ya se encuentra registrado" })
        }

        const nuevoAdmin = new Admin(req.body)
        nuevoAdmin.password = await nuevoAdmin.encryptPassword(password)
        await nuevoAdmin.save()

        res.status(201).json({ msg: "Administrador registrado exitosamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}

// Login del Administrador
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.values(req.body).includes("") || !email || !password) {
            return res.status(400).json({ msg: "Debes llenar todos los campos requeridos" })
        }

        const adminBDD = await Admin.findOne({ email })
        if (!adminBDD) {
            return res.status(404).json({ msg: "El correo electrónico no está registrado" })
        }

        const verificarPassword = await adminBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "La contraseña es incorrecta" })
        }

        const token = crearTokenJWT(adminBDD._id, adminBDD.rol)
        const { nombre, _id, rol } = adminBDD

        res.status(200).json({
            msg: "Inicio de sesión exitoso como Administrador",
            token,
            rol,
            nombre,
            email: adminBDD.email,
            _id
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}

// Ver perfil del Admin logueado
const perfil = (req, res) => {
    try {
        const { password, token, __v, ...datosAdmin } = req.adminHeader.toObject ? req.adminHeader.toObject() : req.adminHeader
        res.status(200).json(datosAdmin)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al obtener el perfil del administrador" })
    }
}

// Actualizar datos del perfil del Administrador (nombre, email)
const actualizarPerfilAdmin = async (req, res) => {
    try {
        const { nombre, email } = req.body
        if (!nombre || !email) {
            return res.status(400).json({ msg: "El nombre y el correo electrónico son obligatorios" })
        }

        const adminBDD = await Admin.findById(req.adminHeader._id)
        if (!adminBDD) {
            return res.status(404).json({ msg: "El administrador no existe" })
        }

        if (adminBDD.email !== email) {
            const emailExistente = await Admin.findOne({ email })
            if (emailExistente) {
                return res.status(400).json({ msg: "El correo electrónico ya se encuentra registrado por otro administrador" })
            }
        }

        adminBDD.nombre = nombre.trim()
        adminBDD.email = email.trim()
        await adminBDD.save()

        res.status(200).json({
            msg: "Perfil de administrador actualizado correctamente",
            nombre: adminBDD.nombre,
            email: adminBDD.email,
            rol: adminBDD.rol,
            _id: adminBDD._id
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}

// Actualizar contraseña del Administrador
const actualizarPasswordAdmin = async (req, res) => {
    try {
        const { passwordActual, confirmPassword } = req.body
        const passwordNueva = confirmPassword || req.body?.passwordNuevo

        if (!passwordActual || !passwordNueva) {
            return res.status(400).json({ msg: "Por favor ingresa tu contraseña actual y la nueva contraseña" })
        }

        const adminBDD = await Admin.findById(req.adminHeader._id)
        if (!adminBDD) {
            return res.status(404).json({ msg: "El administrador no existe" })
        }

        const verificarPassword = await adminBDD.matchPassword(passwordActual)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "La contraseña actual es incorrecta" })
        }

        adminBDD.password = await adminBDD.encryptPassword(passwordNueva)
        await adminBDD.save()

        res.status(200).json({ msg: "Contraseña de administrador actualizada exitosamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}

// Listar todos los usuarios activos (status: true)
const listarUsuariosActivos = async (req, res) => {
    try {
        const usuarios = await userApp.find({ status: true }).select("-password -token -__v -updatedAt")
        res.status(200).json(usuarios)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al listar los usuarios activos" })
    }
}

// Desactivar usuario por su correo electrónico (soft-delete / cambiar status a false)
const desactivarUsuario = async (req, res) => {
    try {
        const email = req.body?.email || req.params?.email

        if (!email) {
            return res.status(400).json({ msg: "Debes proporcionar el correo electrónico del usuario" })
        }

        const userBDD = await userApp.findOne({ email })
        if (!userBDD) {
            return res.status(404).json({ msg: "El usuario no existe o no se encuentra registrado" })
        }

        if (!userBDD.status) {
            return res.status(400).json({ msg: "El usuario ya se encuentra inactivo" })
        }

        userBDD.status = false
        await userBDD.save()

        res.status(200).json({ msg: `El usuario con email ${email} ha sido desactivado exitosamente` })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}

export {
    registro,
    login,
    perfil,
    actualizarPerfilAdmin,
    actualizarPasswordAdmin,
    listarUsuariosActivos,
    desactivarUsuario
}
