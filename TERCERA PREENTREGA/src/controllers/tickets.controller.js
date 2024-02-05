import { v4 as uuidv4 } from "uuid"
import { TicketsService } from "../services/tickets.service.js"
import { CartsService } from "../services/carts.service.js"
import { ProductsService } from "../services/products.service.js"
import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js"

export class TicketsController {
    static purchaseCart = async (req, res) => {
        try {
            const { cid } = req.params

            // Verify that cid exists or throw corresponding error
            const cart = await CartsService.getCartById(cid)

            if (cart.products.length) {
                const ticketProducts = []
                const rejectedProducts = []

                // Check the stock of products
                for (let i = 0; i < cart.products.length; i++) {
                    const productInCart = cart.products[i]
                    const productInfo = productInCart.product

                    if (productInCart.quantity <= productInfo.stock) {
                        ticketProducts.push(productInCart)

                        // Subtract the quantity from the stock
                        const updateStock = productInfo.stock - productInCart.quantity
                        await ProductsService.updateProduct(productInfo._id, { stock: updateStock })
                    } else {
                        rejectedProducts.push(productInCart)
                    }
                }

                const userInfoDto = new GetUserInfoDto(req.user)

                // Create ticket
                const newTicket = {
                    code: uuidv4(),
                    purchase_datetime: new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
                    amount: ticketProducts.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0),
                    purchaser: userInfoDto.email || userInfoDto.github_username,
                    purchase_products: ticketProducts
                }

                // Update cart with rejected products
                const productsRejectedInCart = await CartsService.updateProductsInCart(cid, rejectedProducts)

                if (rejectedProducts.length) {
                    if (ticketProducts.length) {
                        const newPurchase = await TicketsService.purchaseCart(newTicket)
                        res.status(201).json({ message: `Purchase completed <br><br> Purchase code: ${newTicket.code} <br> Buyer: ${newTicket.purchaser} <br> Total: $${newTicket.amount}`, 
                                                error: "<br> These products were not purchased due to lack of stock:", 
                                                productsRejectedInCart })
                    } else {
                        res.status(201).json({ error: "These products were not purchased due to lack of stock:", productsRejectedInCart })
                    }
                } else {
                    const newPurchase = await TicketsService.purchaseCart(newTicket)
                    res.status(201).json({ message: `Purchase completed <br><br> Purchase code: ${newTicket.code} <br> Buyer: ${newTicket.purchaser} <br> Total: $${newTicket.amount}`, 
                                            newPurchase })
                }
            } else {
                res.status(400).json({ error: "The cart is empty" })
            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static getTickets = async (req, res) => {
        try {
            const tickets = await TicketsService.getTickets()
            res.status(201).json({ data: tickets })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static getTicketById = async (req, res) => {
        try {
            const { tid } = req.params
            const ticket = await TicketsService.getTicketById(tid)
            res.status(201).json({ data: ticket })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}