import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

// Signup
router.post("/signup", passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), async (req, res) => {
    res.render("login", { message: "User registered :)"});
});

// Fail signup
router.get("/fail-signup", (req, res) => {
    res.render("signup", { error: "Error completing registration" });
});

// Signup with GitHub
router.get("/signup-github", passport.authenticate("signupGithubStrategy"));

// Callback with GitHub
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), (req, res) => {
    res.redirect("/products");
});

// Login
router.post("/login", passport.authenticate("loginLocalStrategy", {
    failureRedirect: "/api/sessions/fail-login"
}), async (req, res) => {
    res.redirect("/products");
});

// Fail login
router.get("/fail-login", (req, res) => {
    res.render("login", { error: "Error logging in. Please re-enter your credentials" });
});

// Logout
router.get("/logout", async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.render("profile", { error: "Error closing the session" });
            } else {
                return res.redirect("/login");
            }
        });
    } catch (error) {
        res.render("logout", { error: "Error closing the session" });
    }
});

export { router as sessionsRouter };