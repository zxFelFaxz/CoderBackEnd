import { ProductManagerMDB } from "./mdb/productManagerDB.js"
import { CartManagerMDB } from "./mdb/cartManagerDB.js"

export const productManager = new ProductManagerMDB();
export const cartManager = new CartManagerMDB();