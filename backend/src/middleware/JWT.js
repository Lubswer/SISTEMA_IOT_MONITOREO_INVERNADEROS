import jwt from "jsonwebtoken"
import userApp from "../models/userApp.js"
import cultivoUser from "../models/cultivoUser.js"
import Admin from "../models/admin.js"

/**
 * Crear token JWT
 * @param {string} id - ID del usuario
 * @param {string} rol - Rol del usuario
 * @returns {string} token - JWT
 */
const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}




const verificarTokenJWT = async (req, res, next) => {

	const { authorization } = req.headers
    if (!authorization) return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
    try {
        const token = authorization.split(" ")[1]
        console.log("Authorization:", authorization)
        console.log("Token:", token)
        const { id, rol } = jwt.verify(token,process.env.JWT_SECRET)
        if (rol === "usuario") {
            const userAppBDD = await userApp.findById(id).lean().select("-password")
            if (!userAppBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.userAppHeader = userAppBDD
            next()
        } 
        else if (rol === "admin") {
            const adminBDD = await Admin.findById(id).lean().select("-password")
            if (!adminBDD) return res.status(401).json({ msg: "Administrador no encontrado" })
            req.adminHeader = adminBDD
            next()
        }
        else if(rol === "cultivo"){
            const cultivoBDD = await cultivoUser.findById(id).lean().select("-passwordPropietario")
            if (!cultivoBDD) return res.status(401).json({ msg: "Cultivador no encontrado" })          
            req.cultivoHeader = cultivoBDD
            next()
        }
        else{
            const cultivoBDD = await cultivoUser.findById(id).lean().select("-passwordPropietario")
            if (!cultivoBDD) return res.status(401).json({ msg: "Cultivador no encontrado" })          
            req.cultivoHeader = cultivoBDD
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ msg: `Token inválido o expirado - ${error}` })
    }
}


export { 
    crearTokenJWT,
    verificarTokenJWT 
}

