export class SessionsController {
    static redirectLogin = async (req, res) => {
        res.render("login", { message: "Registered user"})
    }

    static failSignup = async (req, res) => {
        res.render("signup", { error: "Error completing registration" })
    }

    static redirectProducts = async (req, res) => {
        res.redirect("/products")
    }

    static failLogin = async (req, res) => {
        res.render("login", { error: "Error logging in. Please re-enter your details" })
    }

    static logout = async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.render("profile", { error: "Error logging out" })
                } else {
                    return res.redirect("/login")
                }
            })
        } catch (error) {
            res.render("logout", { error: "Error logging out" })
        }
    }
}