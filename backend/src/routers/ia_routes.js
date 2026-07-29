import { Router } from "express"
import { responderPreguntaIA } from "../controllers/ia_controller.js"
import { verificarTokenJWT } from "../middleware/JWT.js"

const routerIA = Router()

routerIA.post("/ia/chat", verificarTokenJWT, responderPreguntaIA)

export default routerIA
