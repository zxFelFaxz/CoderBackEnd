import { ProductManagerMDB } from "./mdb/productManagerDB.js"
import { CartManagerMDB } from "./mdb/cartManagerDB.js"
import { SessionManagerDB } from "./mdb/sessionManagerDB.js";

export const productManager = new ProductManagerMDB();
export const cartManager = new CartManagerMDB();
export const sessionManager = new SessionManagerDB();