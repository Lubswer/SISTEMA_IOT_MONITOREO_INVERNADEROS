import { Router } from "express";
import { comprobarTokenPasword, confirmarMail, crearNuevoPassword, recuperarPassword, registro, login, perfil, actualizarPerfil, actualizarPassword, registrarActividad, actualizarEstadoActividad } 
from '../controllers/userApp_controller.js'
import { verificarTokenJWT } from "../middleware/JWT.js"


const routerUserApp = Router();

routerUserApp.post("/registro", registro)
routerUserApp.get("/confirmar/:token", confirmarMail)

routerUserApp.post('/recuperarpassword',recuperarPassword)
routerUserApp.get('/recuperarpassword/:token',comprobarTokenPasword)
routerUserApp.post('/nuevopassword/:token',crearNuevoPassword)
routerUserApp.post('/user/login',login)
routerUserApp.get('/user/perfil',verificarTokenJWT,perfil)

routerUserApp.put('/user/actualizarperfil/:id',verificarTokenJWT,actualizarPerfil)
routerUserApp.put("/user/actualizarpassword/:id", verificarTokenJWT, actualizarPassword)
routerUserApp.post("/user/actividad", verificarTokenJWT, registrarActividad)
routerUserApp.put("/user/actividad/estado", verificarTokenJWT, actualizarEstadoActividad)
export default routerUserApp

