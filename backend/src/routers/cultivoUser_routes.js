import { Router } from "express";
import { registrarCultivo, listarCultivos, detalleCultivo, actualizarCultivo, eliminarCultivo, login, perfil, verificarClaveCultivo } 
from '../controllers/cultivoUser_controller.js'
import { verificarTokenJWT } from "../middleware/JWT.js";

const routerCultivoUser = Router();
routerCultivoUser.post("/cultivo/login", login)

routerCultivoUser.get("/cultivo/perfil", verificarTokenJWT, perfil)

routerCultivoUser.post("/cultivo/registro", verificarTokenJWT, registrarCultivo)

routerCultivoUser.get("/cultivos", verificarTokenJWT, listarCultivos)

routerCultivoUser.get("/cultivo/detalle/:id", verificarTokenJWT, detalleCultivo)

routerCultivoUser.put("/cultivo/actualizar/:id", verificarTokenJWT, actualizarCultivo)

routerCultivoUser.delete("/cultivo/eliminar/:id", verificarTokenJWT, eliminarCultivo)

routerCultivoUser.post("/cultivo/verificar-clave/:id", verificarTokenJWT, verificarClaveCultivo)

export default routerCultivoUser