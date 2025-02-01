import express from "express";
import { 
    registerUser, 
    loginUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Solo los administradores pueden ver todos los usuarios
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

// Cualquier usuario autenticado puede ver su propio perfil
router.get("/:id", authMiddleware, getUserById);

// Solo los administradores pueden actualizar o eliminar usuarios
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

export default router;
