import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";
import { SessionsController } from "../controllers/sessions.controller.js";
import { checkRoleMiddleware } from "../middleware/auth.js";

const router = Router()

// Signup
router.post("/signup", passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup",
    session: false
}), SessionsController.redirectLogin)

// Fail signup
router.get("/fail-signup", SessionsController.failSignup)

// Signup with GitHub
router.get("/signup-github", passport.authenticate("signupGithubStrategy"))

// Callback with GitHub
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), SessionsController.redirectProducts)

// Login
router.post("/login", passport.authenticate("loginLocalStrategy", {
    failureRedirect: "/api/sessions/fail-login"
}), SessionsController.redirectProducts)

// Fail login
router.get("/fail-login", SessionsController.failLogin)

// Logout
router.get("/logout", SessionsController.logout)

// All users
router.get("/users", checkRoleMiddleware(["admin"]), SessionsController.getUsers)

// One user
router.get("/users/:uid", checkRoleMiddleware(["admin"]), SessionsController.getUserById)

export { router as sessionsRouter }