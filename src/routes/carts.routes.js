import { Router } from "express";
import { cartManager } from "../persistence/index.js";

const router = Router();

const handleErrorResponse = (res, error, status = 500) => {
    res.status(status).json({ error: error.message });
};

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ data: newCart, message: "Cart created" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid, 10);
        const cart = await cartManager.getCartById(cid);

        if (cart) {
            res.status(200).json({ data: cart });
        } else {
            res.status(404).json({ error: "Cart not found" });
        }
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid, 10);
        const pid = parseInt(req.params.pid, 10);
        const quantity = parseInt(req.body.quantity || 1);

        await cartManager.addProductToCart(cid, pid, quantity);
        res.status(200).json({ message: `${quantity} of this product added to your cart` });
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

export { router as cartsRouter };