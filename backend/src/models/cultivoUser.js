import mongoose, {Schema, model} from "mongoose";
import bcrypt from "bcrypt";        

const cultivoSchema = new Schema({
    nombrePropietario: {
        type: String,
        required: false,
        trim: true
    },
    passwordPropietario: {
        type: String,
        required: false,
        trim: true
    },
    nombreCultivo: {
        type: String,
        required: true,
        trim: true,
    },
    tipoPlanta: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: String,
        default: 1,
        required: false
    },
    avatarCultivo: {
        type: String,
        trim: true
    },
    avatarCultivoID: {
        type: String,
        trim: true
    },
    avatarCultivoIA: {
        type: String,
        trim: true
    },
    detalleCultivo: {
        type: String,
        trim: true,
        default: "",
        required: false
    },
    fechaIngresoCultivo: {
        type: Date,
        default: Date.now,
        required: false
    },
    fechaSalidaCultivo: {
        type: Date,
        default: null,
        required: false
    },
    estadoCultivo: {
        type: Boolean,
        default: false,
        required: false
    },
    tiempoCosecha: {
        type: String,
        required: false,
        default: "",
        trim: true
    },  
    estadoMadurezCultivo: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "userApp",
        required: true
    },
    tratamientos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tratamiento'
        }
    ],
    token: {
        type: String,
        default: null
    }
},
{
    timestamps: true
})
cultivoSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

cultivoSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordPropietario)
}

cultivoSchema.methods.createToken = function() {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model("cultivoUser", cultivoSchema)


