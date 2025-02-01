import jwt from "jsonwebtoken";

const jwtMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Obtener el token de la cookie

    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token" });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        req.user = decoded; // Guardar la información del usuario decodificada
        next();
    });
};

export default jwtMiddleware;
