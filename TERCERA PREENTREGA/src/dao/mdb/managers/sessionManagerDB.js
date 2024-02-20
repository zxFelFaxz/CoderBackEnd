import { usersModel } from "../models/users.model.js";
import { logger } from "../../../helpers/logger.js";

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
            logger.error("register user: Error completing register")
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
            logger.error("login user: Error login")
            throw new Error ("Error login")
        }
    }

    // Get a user by ID
    async getUserById(userId){
        try {
            const result = await this.model.findById(userId).lean()
            return result
        } catch (error) {
            logger.error("get users: Error  getting user")
            throw new Error("Error getting user")
        }
    }

    // Get all users
    async getUsers() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
            logger.error("get user by id: Error getting all  users")
            throw new Error("Error getting all  users")
        }
    }
}