import { __dirname } from "../utils.js"
import path from "path"
import { ProductManager } from "./ClassProductManager.js"
import { CartManager } from "./ClassCartManager.js"

export const productManager = new ProductManager(path.join(__dirname, "/data/Products.json"))
export const cartManager = new CartManager(path.join(__dirname, "/data/Carts.json"))