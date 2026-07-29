import mongoose, {Schema,model} from 'mongoose'

const tratamientoSchema = new Schema({

    nivelhumedad: {
        type: String,
        required: false,
        trim: true
    },
    nivelRiego: {
        type: String,
        required: false,
        trim: true
    },
    nivelLuz: {
        type: String,
        required: false,
        trim: true
    },
    cultivoUser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cultivoUser'
    }]
    
},{
    timestamps:true
})

export default model('Tratamiento',tratamientoSchema)