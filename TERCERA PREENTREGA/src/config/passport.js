import passport from "passport";
import localStrategy from "passport-local";
import githubStrategy from "passport-github2";
import { config } from "./config.js";
import { createHash, isValidPassword } from "../utils.js";
import { sessionManager } from "../dao/index.js";
import { CreateUserDto } from "../dao/dto/createUser.dto.js";

export const initializePassport = () => {
    // Signup
    passport.use("signupLocalStrategy", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email",
        },

        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body;

            try {
                const user = await sessionManager.loginUser(username)

                // If required fields are not filled
                if (!first_name || !last_name || !age) {
                    return done(null, false);
                }

                // If the user is already registered
                if (user) {
                    return done(null, false);
                }

                // If the user is not registered
                const newUserDto = new CreateUserDto ({
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password),
                    role: (username === config.adminInfo.adminEmail && password === config.adminInfo.adminPassword) ? "admin" : "user",
                    github_user: false
                })

                const createdUser = await usersDao.registerUser(newUserDto)
                return done(null, createdUser)
            } catch (error) {
                return done(error)
            }
        }
    ))

    // Signup with GitHub
    passport.use("signupGithubStrategy", new githubStrategy(
        {
            clientID: config.github.clientId,
            clientSecret: config.github.clientSecret,
            callbackURL: `http://localhost:8080/api/sessions${config.github.callbackUrl}`
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await sessionManager.loginUser(profile.username, true);

                // If the user is already registered
                if (user) {
                    return done(null, user);
                }

                // If the user is not registered
                const newUserDto = new CreateUserDto ({
                    github_name: profile._json.name,
                    github_username: profile.username,
                    role: "user",
                    github_user: true
                })

                const createdUser = await sessionManager.registerUser(newUserDto)
                return done(null, createdUser)
            } catch (error) {
                return done(error)
            }
        }
    ))

    // Login
    passport.use("loginLocalStrategy", new localStrategy(
        {
            usernameField: "email",
        },

        async (username, password, done) => {
            try {
                const user = await sessionManager.loginUser(username)

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