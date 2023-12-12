import {ProductManagerMDB} from "../dao/mdb/productManagerDB.js"
import {CartManagerMDB} from "../dao/mdb/cartManagerDB.js"

export const productManager = new ProductManagerMDB()
export const cartManager = new CartManagerMDB()