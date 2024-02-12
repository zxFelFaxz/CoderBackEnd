import { sessionManager } from "../dao/index.js"

export class SessionsController {
    static redirectLogin = async (req, res) => {
        res.render("login", { message: "User registered" })
    }

    static failSignup = async (req, res) => {
        res.render("signup", { error: `
                                    Error completing the registration

                                    All fields are required:
                                    - Name: must be text
                                    - Last Name: must be text
                                    - Age: must be a number
                                    - Email: must not already have an existing account
                                    - Password: is required
                                `
        })
    }

    static redirectProducts = async (req, res) => {
        res.redirect("/products")
    }

    static failLogin = async (req, res) => {
        res.render("login", { error: `
                                    Error logging in

                                    Please re-enter your data:
                                    - The entered email must belong to an existing account
                                    - The password may be incorrect
                                ` 
        })
    }

    static logout = async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.render("profile", { error: "Error closing session" })
                } else {
                    return res.redirect("/login")
                }
            })
        } catch (error) {
            res.render("logout", { error: "Error closing session" })
        }
    }

    static getUsers = async (req, res) => {
        try {
            const users = await sessionManager.getUsers()
            res.json({ status: "success", data: users })
        } catch (error) {
            res.json({ status: "error", error: "Error retrieving users" })
        }
    }

    static getUserById = async (req, res) => {
        try {
            const { uid } = req.params
            const user = await sessionManager.getUserById(uid)
            res.json({ status: "success", data: user })
        } catch (error) {
            res.json({ status: "error", error: "Error retrieving user" })
        }
    }
}