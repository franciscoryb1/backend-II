const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acceso denegado, permisos insuficientes" });
        }
        next();
    };
};

export default roleMiddleware;
