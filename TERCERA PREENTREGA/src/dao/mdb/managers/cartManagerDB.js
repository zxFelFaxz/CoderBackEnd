import { cartsModel } from "../models/carts.model.js";
import mongoose from 'mongoose';
import { logger } from "../../../helpers/logger.js";

export class CartManagerMDB {
    constructor() {
        this.model = cartsModel;
    }
    // Get all carts
    async getCarts() {
        try {
            const result = await this.model.find().populate("products.product").lean()
            return result;
        } catch (error) {
            if (error.message.includes("Cast to ObjectId failed")) {
                console.log("getCarts: Invalid ObjectId in products.product");
                throw new Error("Error retrieving carts. Invalid ObjectId in products.product");
            } else {
                logger.error("get carts: Error getting carts");
                throw new Error("Error retrieving carts");
            }
        }
    }

    // Get a cart by ID
    async getCartById(cartId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error("Invalid cart ID");
            }
            const objectId = new mongoose.Types.ObjectId(cartId);
            const result = await this.model.findById(objectId).populate("products.product").lean();
            console.log(result)
            if (!result) {
                throw new Error("Cart not found");
            }
            return result;
        } catch (error) {
            logger.error("get cart by id: error getting the cart");
            throw new Error("Error retrieving the cart");
        }
    }

    // Create a cart
    async createCart() {
        try {
            const newCart = {};
            const result = await this.model.create(newCart);
            return result;
        } catch (error) {
            logger.error("create cart: Error creating cart");
            throw new Error("Error creating the cart");
        }
    }

    // Add a product to a cart
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productInCart = cart.products.find((product) => product.product._id == productId);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
            return result;
        } catch (error) {
            logger.error("add product to cart: Error adding the product to cart");
            throw new Error("Error adding the product to the cart");
        }
    }

    // Update a cart with an array of products
    async updateProductsInCart(cartId, newProducts) {
        try {
            const cart = await this.getCartById(cartId);

            cart.products = newProducts;

            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
            return result;
        } catch (error) {
            logger.error("update products in cart: Error updapting the cart's products");
            throw new Error("Error updating the cart's products");
        }
    }

    // Update the quantity of a product in the cart
    async updateProductQuantityInCart(cartId, productId, newQuantity) {
        try {
            const cart = await this.getCartById(cartId);
            const productInCartIndex = cart.products.findIndex((product) => product.product._id == productId);

            if (productInCartIndex >= 0) {
                cart.products[productInCartIndex].quantity = newQuantity;

                if (newQuantity >= 1) {
                    const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                    return result;
                } else {
                    throw new Error("Quantity must be greater than or equal to 1");
                }
            } else {
                throw new Error("Cannot update quantity because the product is not in the cart");
            }
        } catch (error) {
            logger.error("update product quantity in cart: Error updating the quantity of the product in the cart");
            throw new Error("Error updating the quantity of the product in the cart");
        }
    }

    // Delete all products from a cart
    async deleteAllProductsInCart(cartId, newCart) {
        try {
            const cart = await this.getCartById(cartId);

            newCart = [];
            cart.products = newCart;

            const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
            return result;
        } catch (error) {
            logger.error("delete all products in cart: Error deleting products from the cart");
            throw new Error("Error deleting products from the cart");
        }
    }

    // Delete a product from the cart
    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            const productInCart = cart.products.find((product) => product.product._id == productId);

            if (productInCart) {
                const newProducts = cart.products.filter((product) => product.product._id != productId);

                cart.products = newProducts;

                const result = await this.model.findByIdAndUpdate(cartId, cart, { new: true });
                return result;
            } else {
                throw new Error("The product to delete is not in the cart");
            }
        } catch (error) {
            logger.error("delete product in cart: Error deleting the  product from the cart");
            throw new Error("Error deleting the product from the cart");
        }
    }
}