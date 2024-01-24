// If there is no active session
export const noSessionMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login")
    }
    next()
}

// If there is an active session
export const sessionMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile")
    }
    next()
}