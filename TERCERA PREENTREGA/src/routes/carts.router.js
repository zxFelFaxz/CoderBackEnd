import { Router } from "express"
import { noSessionMiddleware, checkRoleMiddleware } from "../middleware/auth.js"
import { CartsController } from "../controllers/carts.controller.js"
import { TicketsController } from "../controllers/tickets.controller.js"

const router = Router()

// Get all carts (GET: http://localhost:8080/api/carts)
router.get("/", noSessionMiddleware, CartsController.getCarts)

// Get all purchase tickets (GET: http://localhost:8080/api/carts/tickets)
router.get("/tickets", noSessionMiddleware, TicketsController.getTickets)

// Get a cart by ID (GET: http://localhost:8080/api/carts/cid)
router.get("/:cid", noSessionMiddleware, CartsController.getCartById)

// Get a purchase ticket by ID (GET: http://localhost:8080/api/carts/cid/tickets/tid)
router.get("/:cid/tickets/:tid", noSessionMiddleware, TicketsController.getTicketById)

// Create a cart (POST: http://localhost:8080/api/carts)
router.post("/", noSessionMiddleware, CartsController.createCart)

// Add a product to a cart (POST: http://localhost:8080/api/carts/cid/product/pid)
router.post("/:cid/product/:pid", noSessionMiddleware, checkRoleMiddleware(["user"]), CartsController.addProductToCart)

// Update a cart with an array of products (PUT: http://localhost:8080/api/carts/cid)
router.put("/:cid", noSessionMiddleware, checkRoleMiddleware(["user"]), CartsController.updateProductsInCart)

// Update the quantity of a product in the cart (PUT: http://localhost:8080/api/carts/cid/products/pid)
router.put("/:cid/products/:pid", noSessionMiddleware, checkRoleMiddleware(["user"]), CartsController.updateProductQuantityInCart)

// Remove all products from a cart (DELETE: http://localhost:8080/api/carts/cid)
router.delete("/:cid", noSessionMiddleware, CartsController.deleteAllProductsInCart)

// Remove a product from the cart (DELETE: http://localhost:8080/api/carts/cid/products/pid)
router.delete("/:cid/products/:pid", noSessionMiddleware, CartsController.deleteProductInCart)

// Complete purchase (POST: http://localhost:8080/api/carts/cid/purchase)
router.post("/:cid/purchase", noSessionMiddleware, checkRoleMiddleware(["user"]), TicketsController.purchaseCart)

export { router as cartsRouter }