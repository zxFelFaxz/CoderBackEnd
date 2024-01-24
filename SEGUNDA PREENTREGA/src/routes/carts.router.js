import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";

const router = Router();

// Get all carts (GET: http://localhost:8080/api/carts)
router.get("/", CartsController.getCarts);

// Get a cart by ID (GET: http://localhost:8080/api/carts/cid)
router.get("/:cid", CartsController.getCartById);

// Create a cart (POST: http://localhost:8080/api/carts)
router.post("/", CartsController.createCart);

// Add a product to a cart (POST: http://localhost:8080/api/carts/cid/product/pid)
router.post("/:cid/product/:pid", CartsController.addProductToCart);

// Update a cart with an array of products (PUT: http://localhost:8080/api/carts/cid)
router.put("/:cid", CartsController.updateProductsInCart);

// Update the quantity of a product in the cart (PUT: http://localhost:8080/api/carts/cid/products/pid)
router.put("/:cid/products/:pid", CartsController.updateProductQuantityInCart);

// Delete all products from a cart (DELETE: http://localhost:8080/api/carts/cid)
router.delete("/:cid", CartsController.deleteAllProductsInCart);

// Delete a product from the cart (DELETE: http://localhost:8080/api/carts/cid/products/pid)
router.delete("/:cid/products/:pid", CartsController.deleteProductInCart);

export { router as cartsRouter };