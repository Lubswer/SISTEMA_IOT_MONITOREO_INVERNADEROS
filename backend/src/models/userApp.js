import {Schema, model, trusted} from "mongoose";
import bcrypt, { truncates } from "bcryptjs";

const userAppSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido:{
        type: String,
        required: true,
        trim: true
    },
    direccion:{
        type: String,
        default: true,
        trim:true
    },
    celular: {
        type: String,
        trim: true,
        default: null
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
    status: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        default: null
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    rol: {
        type: String,
        default: "usuario"
    },
    latitud: {
        type: Number,
        default: null
    },
    longitud: {
        type: Number,
        default: null
    },
    actividades:{
        type: Array,
        default: []
    },
    avatar: {
        type: String,
        default: null,
        trim: true
    },
    avatarID: {
        type: String,
        default: null,
        trim: true
    }
}, {
    timestamps: true
})

userAppSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

userAppSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userAppSchema.methods.createToken = function() {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model('userApp', userAppSchema)

