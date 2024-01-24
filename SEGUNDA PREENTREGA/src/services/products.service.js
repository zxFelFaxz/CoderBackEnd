import { productManager } from "../dao/index.js"

export class ProductsService {
    static getProductsNoFilter() {
        return productManager.getProductsNoFilter()
    }

    static getProducts(query, options) {
        return productManager.getProducts(query, options)
    }

    static getProductById(productId) {
        return productManager.getProductById(productId)
    }

    static addProduct(productInfo) {
        return productManager.addProduct(productInfo)
    }

    static updateProduct(productId, updateFields) {
        return productManager.updateProduct(productId, updateFields)
    }

    static deleteProduct(productId) {
        return productManager.deleteProduct(productId)
    }
}