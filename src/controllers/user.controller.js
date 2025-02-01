import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registro de usuario
export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Crear usuario nuevo
        const newUser = new User({ first_name, last_name, email, age, password });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado correctamente", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error: error.message });
    }
};

// Login de usuario con JWT
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifico si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Verifico la contraseña
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Genero token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Guardo el token en una cookie
        res.cookie("token", token, { httpOnly: true, secure: false });

        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error: error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        
        // Encriptar la nueva contraseña
        let updatedFields = { first_name, last_name, email, age, role };
        if (password) {
            updatedFields.password = bcrypt.hashSync(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
    }
};
