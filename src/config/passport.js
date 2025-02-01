import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Verifico si el usuario ya existe
                let user = await User.findOne({ email: profile.emails[0].value });

                // Si el usuario no existe, creo uno nuevo
                if (!user) {
                    user = new User({
                        first_name: profile.displayName,
                        last_name: "",
                        email: profile.emails[0].value,
                        password: "",
                        role: "user",
                    });
                    await user.save();
                }

                // Retorno el usuario
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
