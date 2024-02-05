import { cartManager } from "../dao/index.js"

export class CartsService {
    static getCarts() {
        return cartManager.getCarts()
    }

    static getCartById(cartId) {
        return cartManager.getCartById(cartId)
    }

    static createCart() {
        return cartManager.createCart()
    }

    static addProductToCart(cartId, productId) {
        return cartManager.addProductToCart(cartId, productId)
    }

    static updateProductsInCart(cartId, newProducts) {
        return cartManager.updateProductsInCart(cartId, newProducts)
    }

    static updateProductQuantityInCart(cartId, productId, newQuantity) {
        return cartManager.updateProductQuantityInCart(cartId, productId, newQuantity)
    }

    static deleteAllProductsInCart(cartId, newCart) {
        return cartManager.deleteAllProductsInCart(cartId, newCart)
    }

    static deleteProductInCart(cartId, productId) {
        return cartManager.deleteProductInCart(cartId, productId)
    }
}