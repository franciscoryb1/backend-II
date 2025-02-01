import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        // Extraer el token de la cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No autorizado, token no encontrado" });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardar los datos del usuario en req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export default authMiddleware;
