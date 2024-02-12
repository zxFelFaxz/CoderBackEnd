import { v4 as uuidv4 } from "uuid";
import { TicketsService } from "../services/tickets.service.js";
import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js";
import { ticketsModel } from "../dao/mdb/models/tickets.model.js";
import { CustomError } from "../services/customErrors/customError.service.js";
import { Errors } from "../enums/Errors.js";
import { dataBaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js";
import { purchaseCartError } from "../services/customErrors/errors/ticketsErrors.service.js";

export class TicketsController {
    static purchaseCart = async (req, res, next) => {
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

                // Custom error
                const infoTicket = new ticketsModel(newTicket)

                try {
                    await infoTicket.validate()
                } catch {
                    CustomError.createError ({
                        name: "purchase cart error",
                        cause: purchaseCartError(newTicket),
                        message: "Error completing the purchase",
                        errorCode: Errors.INVALID_BODY_ERROR
                    })
                }

                // Update cart with rejected products
                const productsRejectedInCart = await CartsService.updateProductsInCart(cid, rejectedProducts)

                if (rejectedProducts.length) {
                    if (ticketProducts.length) {
                        const newPurchase = await TicketsService.purchaseCart(newTicket)
                        res.json({
                            status: "success",
                            message: `
                                Purchase completed

                                Purchase code: ${newTicket.code}
                                Buyer: ${newTicket.purchaser}
                                Total price: $${newTicket.amount}

                            `,
                            error: "These products were not purchased due to lack of stock.:",
                            productsRejectedInCart
                        })
                    } else {
                        res.json({ status: "error", error: "These products were not purchased due to lack of stock.:", productsRejectedInCart })
                    }
                } else {
                    const newPurchase = await TicketsService.purchaseCart(newTicket)

                    res.json({
                        status: "success",
                        message: `
                            Purchase completed

                            Purchase code: ${newTicket.code}
                            Buyer: ${newTicket.purchaser}
                            Total price: $${newTicket.amount}
                        `,
                        newPurchase
                    })
                }
            } else {
                res.json({ status: "error", error: "The cart is empty" })
            }
        } catch (error) {
            next(error)
        }
    }

    static getTickets = async (req, res, next) => {
        try {
            const tickets = await TicketsService.getTickets()

            // Custom error
            if (!tickets) {
                CustomError.createError ({
                    name: "get tickets error",
                    cause: dataBaseGetError(),
                    message: "Error getting purchase tickets",
                    errorCode: Errors.DATABASE_ERROR
                })
            }

            res.json({ status: "success", data: tickets })
        } catch (error) {
            next(error)
        }
    }

    static getTicketById = async (req, res, next) => {
        try {
            const { tid } = req.params
            const ticket = await TicketsService.getTicketById(tid)

            // Custom error
            if (!ticket) {
                CustomError.createError ({
                    name: "get ticket by id error",
                    cause: paramError(tid),
                    message: "Error getting purchase tickets",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", data: ticket })
        } catch (error) {
            next(error)
        }
    }
}