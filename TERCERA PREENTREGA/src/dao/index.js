import { ProductManagerMDB } from "./mdb/managers/productManagerDB.js";
import { CartManagerMDB } from "./mdb/managers/cartManagerDB.js";
import { SessionManagerDB } from "./mdb/managers/sessionManagerDB.js";
import { TicketManagerDB } from  "./mdb/managers/ticketManagerDB.js";

export const productManager = new ProductManagerMDB();
export const cartManager = new CartManagerMDB();
export const sessionManager = new SessionManagerDB();
export const ticketsDao = new TicketManagerDB();