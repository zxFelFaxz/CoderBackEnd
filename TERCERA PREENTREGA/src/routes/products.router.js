import { Router } from "express"
import { uploader } from "../utils.js"
import { noSessionMiddleware, checkRoleMiddleware } from "../middleware/auth.js"
import { ProductsController } from "../controllers/products.controller.js"

const router = Router()

// Get all products (GET: http://localhost:8080/api/products?limit=8&page=1)
router.get("/", noSessionMiddleware, ProductsController.getProducts)

// Get a product by ID (GET: http://localhost:8080/api/products/pid)
router.get("/:pid", noSessionMiddleware, ProductsController.getProductById)

// Add a product (POST: http://localhost:8080/api/products)
router.post("/", uploader.single("thumbnail"), noSessionMiddleware, checkRoleMiddleware(["admin"]), ProductsController.addProduct)

// Updated a product (PUT: http://localhost:8080/api/products/pid)
router.put("/:pid", uploader.single("thumbnail"), noSessionMiddleware, checkRoleMiddleware(["admin"]), ProductsController.updateProduct)

// Delete a product (DELETE: http://localhost:8080/api/products/pid)
router.delete("/:pid", noSessionMiddleware, checkRoleMiddleware(["admin"]), ProductsController.deleteProduct)

export { router as productsRouter }