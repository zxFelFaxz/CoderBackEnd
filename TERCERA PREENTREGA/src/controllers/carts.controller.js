import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { CustomError } from "../services/customErrors/customError.service.js";
import { Errors } from "../enums/Errors.js";
import { dataBaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js";
import { createCartError, addProductToCartError, updateProductsInCartError, updateProductQuantityInCartError } from "../services/customErrors/errors/cartsErrors.service.js";

export class CartsController {
    static getCarts = async (req, res, next) => {
        try {
            const carts = await CartsService.getCarts()

            // Custom error
            if (!carts) {
                CustomError.createError ({
                    name: "get carts error",
                    cause: dataBaseGetError(),
                    message: "Error getting cart",
                    errorCode: Errors.DATABASE_ERROR
                })
            }
            res.json({ status: "success", data: carts })
        } catch (error) {
            next(error)
        }
    }

    static getCartById = async (req, res, next) => {
        try {
            const { cid } = req.params
            const cart = await CartsService.getCartById(cid)

            // Custom error
            if (!cart) {
                CustomError.createError ({
                    name: "get cart by id error",
                    cause: paramError(cid),
                    message: "Error getting cart",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }
            res.json({ status: "success", data: cart })
        } catch (error) {
            next(error)
        }
    }

    static createCart = async (req, res, next) => {
        try {
            const createdCart = await CartsService.createCart()
            
            // Custom error
            if (!createdCart) {
                CustomError.createError ({
                    name: "create cart error",
                    cause: createCartError(),
                    message: "Error getting cart",
                    errorCode: Errors.DATABASE_ERROR
                })
            }
            res.json({ status: "success", message: "Cart created", data: createdCart })
        } catch (error) {
            next(error)
        }
    }

    static addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
    
            // Verify that cid and pid exist or throw corresponding error
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
            
            const customQuantity = quantity ?? 1

            // Custom error
            if (isNaN(customQuantity) || customQuantity < 0) {
                CustomError.createError ({
                    name: "add product to cart error",
                    cause: addProductToCartError(customQuantity),
                    message: "Error adding the product to cart",
                    errorCode: Errors.INVALID_BODY_ERROR
                })
            }
            const addedProductToCart = await CartsService.addProductToCart(cid, pid, customQuantity)
            res.json({ status: "success", message: "Product add to cart", data: addedProductToCart })
        } catch (error) {
            next(error)
        }
    }

    static updateProductsInCart = async (req, res, next) => {
        try {
            const { cid } = req.params
            const { newProducts } = req.body
    
            // Verify that cid exists or throw corresponding error
            const cart = await CartsService.getCartById(cid)

            // Custom error
            if (!Array.isArray(newProducts)) {
                CustomError.createError({
                    name: "update products in cart error",
                    cause: updateProductsInCartError(newProducts),
                    message: "Error validating data",
                    errorCode: Errors.INVALID_BODY_ERROR,
                })
            }

            for (const product of newProducts) {
                if (
                    !product || typeof product !== "object" ||
                    !product.product || !product.quantity ||
                    isNaN(product.quantity) || product.quantity < 0
                ) {
                    CustomError.createError({
                        name: "update products in cart error",
                        cause: updateProductsInCartError(product),
                        message: "Error validating data",
                        errorCode: Errors.INVALID_BODY_ERROR,
                    })
                }
            }

            const updatedProductsInCart = await CartsService.updateProductsInCart(cid, newProducts)
            res.json({ status: "success", message: "Products in cart updated", data: updatedProductsInCart })
        } catch (error) {
            next(error)
        }
    }

    static updateProductQuantityInCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params
            const { newQuantity } = req.body
    
            // Verify that cid and pid exist or throw corresponding error
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
    
            // Custom error
            if (isNaN(newQuantity) || newQuantity < 0) {
                CustomError.createError ({
                    name: "update product quantity in cart error",
                    cause: updateProductQuantityInCartError(newQuantity),
                    message: "Error updating product quantity in the cart",
                    errorCode: Errors.INVALID_BODY_ERROR
                })
            }

            const updatedQuantityProductInCart = await CartsService.updateProductQuantityInCart(cid, pid, newQuantity)
            res.json({ status: "success", message: "Product quantity updated", data: updatedQuantityProductInCart })
        } catch (error) {
            next(error)
        }
    }

    static deleteAllProductsInCart = async (req, res, next) => {
        try {
            const { cid } = req.params
            const { newCart } = req.body
    
            // Verify that cid exists or throw corresponding error
            const cart = await CartsService.getCartById(cid)
    
            // Custom error
            if (!cart) {
                CustomError.createError ({
                    name: "delete all products in cart error",
                    cause: paramError(cid),
                    message: "Error getting the cart to empty",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }

            const emptyNewCart = await CartsService.deleteAllProductsInCart(cid, newCart)
            res.json({ status: "success", message: "Cart emptied", data: emptyNewCart })
        } catch (error) {
            next(error)
        }
    }

    static deleteProductInCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params
    
            // Verify that cid and pid exist or throw corresponding error
            const cart = await CartsService.getCartById(cid)
            const product = await ProductsService.getProductById(pid)
    
            // Custom error
            if (!cart) {
                CustomError.createError ({
                    name: "delete product in cart error",
                    cause: paramError(cid),
                    message: "Error getting the cart to update",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }

            if (!product) {
                CustomError.createError ({
                    name: "delete product in cart error",
                    cause: paramError(pid),
                    message: "Error getting the product to be deleted",
                    errorCode: EError.INVALID_PARAM_ERROR
                })
            }

            const newCart = await CartsService.deleteProductInCart(cid, pid)
            res.json({ status: "success", message: "Product removed from cart", data: newCart })
        } catch (error) {
            next(error)
        }
    }
}