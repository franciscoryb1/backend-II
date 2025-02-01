import express from "express";
import passport from "passport";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

// Ruta para iniciar sesión con GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Ruta de callback de GitHub
router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    async (req, res) => {
        // Generar JWT después de la autenticación con GitHub
        const token = generateToken(req.user.id);
        
        // Enviar el token al frontend
        res.cookie("token", token, { httpOnly: true }); // Guardar el token en la cookie
    }
);

// Ruta para obtener los datos del usuario autenticado
router.get("/profile", jwtMiddleware, (req, res) => {
    res.status(200).json(req.user); 
});


export default router;
