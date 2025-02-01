import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js"; 

const router = express.Router();

// Ruta para obtener los datos del usuario autenticado
router.get("/current", jwtMiddleware, (req, res) => {
    res.status(200).json(req.user);
});

export default router;