import { usersModel } from "../models/users.model.js"

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
    async loginUser(loginIdentifier, isGithubLogin = false) {
        try {
            if(isGithubLogin){
                const result = await this.model.findOne({githubUsername: loginIdentifier})
                return result
            }else{
            const result = await this.model.findOne({ email: loginIdentifier })
            return result
            }
        } catch (error) {
            console.log("loginUser: ", error.message)
            throw new Error ("Error login")
        }
    }

    // Get a user by ID
    async getUserById(userId){
        try {
            const result = await this.model.findById(userId).lean()
            return result
        } catch (error) {
            console.log("getUserById: ", error.message)
            throw new Error("Error getting user")
        }
    }
}