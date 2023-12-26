import { usersModel } from "./models/users.model.js"

export class SessionManagerDB {
    constructor() {
        this.model = usersModel
    }

    // Signup
    async registerUser(signupForm) {
        try {
            const result = await this.model.create(signupForm)
            return result
        } catch (error) {
            console.log("registerUser: ", error.message)
            throw new Error ("Error completing register")
        }
    }

    // Login
    async loginUser(email) {
        try {
            const result = await this.model.findOne({ email })
            return result
        } catch (error) {
            console.log("loginUser: ", error.message)
            throw new Error ("Error login")
        }
    }

    // Obtener un usuario por ID
    async getUserById(id){
        try {
            const result = await this.model.findById(id)
            return result
        } catch (error) {
            console.log("getUserById: ", error.message)
            throw new Error("Error getting user")
        }
    }
}