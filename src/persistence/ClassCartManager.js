import fs from "fs"
import path from "path";
import { ProductManager } from "./ClassProductManager.js"

export class CartManager {
    constructor(filePath) {
        this.filePath = filePath
    }

    fileExists() {
        return fs.existsSync(this.filePath)
    }

    // Get the carts
    async getCarts() {
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.filePath, "utf-8")
                const carts = JSON.parse(content)
                return carts
            } else {
                return []
            }
        } catch (error) {
            throw new Error("Error getting carts from file")
        }
    }

    // Create a cart
    async createCart() {
        try {
            if (this.fileExists()) {
                const carts = await this.getCarts()

                // Autogenerate ID
                const newCartId = carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0)
                const newCart = { id: newCartId + 1, products: [] }

                // Create new cart
                carts.push(newCart)
                await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, "\t"))
                return newCart
            } else {
                throw new Error("Error when creating the cart: error getting the carts from the file")
            }
        } catch (error) {
            throw error
        }
    }

    // Get a cart by its ID
    async getCartById(id) {
        try {
            if (this.fileExists()) {
                const carts = await this.getCarts()
                const cart = carts.find((cart) => cart.id === id)

                if (cart) {
                    return cart
                } else {
                    throw new Error(`Error when searching for cart: cart with ID ${id} does not exist`)
                }
            } else {
                throw new Error("Error when searching for the cart: error when getting the carts from file")
            }
        } catch (error) {
            throw error
        }
    }

    // Add a product to a cart
    async addProductToCart(cartId, productId, quantity) {
        try {
            if (this.fileExists()) {
                const carts = await this.getCarts();
                const cart = await this.getCartById(cartId);
    
                // Check if quantity is a valid number
                if (isNaN(quantity) || quantity < 1) {
                    throw new Error("Error adding the product to the cart: quantity must be a number greater than or equal to 1");
                }
    
                if (cart) {
                    // Here, we get the product from ProductManager by its ID
                    // const productManager = new ProductManager(path.join(__dirname, "../data/Products.json"));
                    // const productManager = new ProductManager(path.join(path.dirname(import.meta.url), "/data/Products.json"));
                    const productManager = new ProductManager(path.join(new URL(import.meta.url).pathname, "../data/Products.json"));


                    const product = await productManager.getProductById(productId);
    
                    if (product) {
                        const productInCart = cart.products.find((product) => product.product === productId);
    
                        if (productInCart) {
                            productInCart.quantity += quantity;
                        } else {
                            cart.products.push({ product: productId, quantity });
                        }
    
                        // Update the cart
                        const cartIndex = carts.findIndex((cart) => cart.id === cartId);
                        carts[cartIndex] = cart;
    
                        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, "\t"));
                    }
                } else {
                    throw new Error("Error adding the product to the cart: error getting the carts from the file");
                }
            } }catch (error) {
                throw error;
            }
        }
}