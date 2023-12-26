import passport from "passport";
import localStrategy from "passport-local";
import githubStrategy from "passport-github2";
import { config } from "./config.js";
import { createHash, isValidPassword } from "../utils.js";
import { sessionManager } from "../dao/index.js";

export const initializePassport = () => {
    // Signup
    passport.use("signupLocalStrategy", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email",
        },

        async (req, username, password, done) => {
            const { first_name, last_name, age, role } = req.body;

            try {
                const user = await sessionManager.loginUser(username);

                // If required fields are not filled
                if (!first_name || !last_name || !age) {
                    return done(null, false);
                }

                // If the user is already registered
                if (user) {
                    return done(null, false);
                }

                // If the user is not registered
                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password),
                    role: "user"
                };

                const createdUser = await sessionManager.registerUser(newUser);
                return done(null, createdUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Signup with GitHub
    passport.use("signupGithubStrategy", new githubStrategy(
        {
            clientID: config.github.clientId,
            clientSecret: config.github.clientSecret,
            callbackURL: `http://localhost:8080/api/sessions/${config.github.callbackUrl}`
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await sessionManager.loginUser(profile.username);

                // If the user is already registered
                if (user) {
                    return done(null, user);
                }

                // If the user is not registered
                const newUser = {
                    githubUser: true,
                    githubName: profile._json.name,
                    githubUsername: profile.username,
                    role: "user",
                };

                const createdUser = await sessionManager.registerUser(newUser);
                return done(null, createdUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Login
    passport.use("loginLocalStrategy", new localStrategy(
        {
            usernameField: "email",
        },

        async (username, password, done) => {
            try {
                const user = await sessionManager.loginUser(username);

                // If the user does not exist
                if (!user) {
                    return done(null, false);
                }

                // If the password is incorrect
                if (!isValidPassword(password, user)) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Serialization
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialization
    passport.deserializeUser(async (id, done) => {
        const user = await sessionManager.getUserById(id);
        done(null, user);
    });
};