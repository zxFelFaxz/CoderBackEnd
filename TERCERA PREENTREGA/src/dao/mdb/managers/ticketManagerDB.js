import { ticketsModel } from "../models/tickets.model.js"

export class TicketManagerDB {
    constructor() {
        this.model = ticketsModel
    }

    // Create a purchase ticket
    async purchaseCart(newTicket) {
        try {
            const result = await this.model.create(newTicket)
            return result
        } catch (error) {
            console.log("purchaseCart: ", error.message)
            throw new Error("Error creating the purchase ticket")
        }
    }

    // Get all purchase tickets
    async getTickets() {
        try {
            const result = await this.model.find().lean()
            return result
        } catch (error) {
            console.log("getTickets: ", error.message)
            throw new Error("Error getting purchase tickets")
        }
    }

    // Get a purchase ticket by ID
    async getTicketById(ticketId) {
        try {
            const result = await this.model.findById(ticketId).lean()

            if (!result) {
                throw new Error("Purchase ticket not found")
            }

            return result
        } catch (error) {
            console.log("getTicketById: ", error.message)
            throw new Error("Error getting the purchase ticket")
        }
    }
}