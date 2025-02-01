import jwt from "jsonwebtoken";

// Función para generar el JWT
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
