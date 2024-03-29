import { Router } from "express";
import { uploader } from "../utils.js";
import { ProductsController } from "../controllers/products.controller.js";

const router = Router();

// Get all products (http://localhost:8080/api/products || http://localhost:8080/api/products?limit=1&page=1)
router.get("/", ProductsController.getProducts);

// Get a product by ID (http://localhost:8080/api/products/pid)
router.get("/:pid", ProductsController.getProductById);

// Add a product (POST: http://localhost:8080/api/products)
router.post("/", uploader.single("thumbnail"), ProductsController.addProduct);

// Update a product (PUT: http://localhost:8080/api/products/pid)
router.put("/:pid", uploader.single("thumbnail"), ProductsController.updateProduct);

// Delete a product (DELETE: http://localhost:8080/api/products/pid)
router.delete("/:pid", ProductsController.deleteProduct);

export { router as productsRouter };
