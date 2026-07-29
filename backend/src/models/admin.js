import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        default: "Administrador"
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: "admin"
    },
    token: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

// Método para encriptar la contraseña
adminSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

// Método para comparar contraseñas
adminSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Método para crear token
adminSchema.methods.createToken = function () {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model("Admin", adminSchema)
