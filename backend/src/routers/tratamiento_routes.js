import {Router} from 'express'
import { eliminarTratamiento, registrarTratamiento } from '../controllers/tratamiento_controller.js'
import { verificarTokenJWT } from '../middleware/JWT.js'
const router = Router()


router.post('/tratamiento/registro',verificarTokenJWT,registrarTratamiento)

router.delete('/tratamiento/eliminar',verificarTokenJWT,eliminarTratamiento)

export default router