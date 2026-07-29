import { Router } from "express";
import { 
    login, 
    perfil, 
    actualizarPerfilAdmin, 
    actualizarPasswordAdmin, 
    listarUsuariosActivos, 
    desactivarUsuario, 
    registro 
} from "../controllers/admin_controller.js";
import { verificarTokenJWT } from "../middleware/JWT.js";

const router = Router();

// Rutas públicas de Administrador
router.post("/admin/registro", registro);
router.post("/admin/login", login);

// Rutas protegidas para el Administrador
router.get("/admin/perfil", verificarTokenJWT, perfil);
router.put("/admin/actualizarperfil", verificarTokenJWT, actualizarPerfilAdmin);
router.put("/admin/actualizarpassword", verificarTokenJWT, actualizarPasswordAdmin);
router.get("/admin/usuarios", verificarTokenJWT, listarUsuariosActivos);
router.delete("/admin/usuario/desactivar", verificarTokenJWT, desactivarUsuario);

export default router;
