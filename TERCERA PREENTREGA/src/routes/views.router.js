import { Router} from "express"
import { noSessionMiddleware, sessionMiddleware, checkRoleMiddleware } from "../middleware/auth.js"
import { ViewsController } from "../controllers/views.controller.js"

const router = Router()

// Products in home (If there is no active session redirect to login)
router.get("/", noSessionMiddleware, ViewsController.renderHome)

// Real-time products
router.get("/realtimeproducts", noSessionMiddleware, checkRoleMiddleware(["admin"]), ViewsController.renderRealTimeProducts)

// All products
router.get("/products", noSessionMiddleware, ViewsController.renderProducts)

// Product detail
router.get("/products/:pid", noSessionMiddleware, ViewsController.renderProductDetail)

// Cart
router.get("/carts/:cid", noSessionMiddleware, checkRoleMiddleware(["user"]), ViewsController.renderCart)

// Signup
router.get("/signup", sessionMiddleware, ViewsController.renderSignup)

// Login
router.get("/login", sessionMiddleware, ViewsController.renderLogin)

// Profile
router.get("/profile", noSessionMiddleware, ViewsController.renderProfile)

// Logger test
router.get("/loggertest", ViewsController.loggerTest)

export { router as viewsRouter }