//  Start event CartUpdated
const cartUpdatedEvent = () => {
    document.dispatchEvent(new Event("cartUpdated"))
}

// Update quantity of products in the shopping cart
const updateProductQuantityInCartBtn = document.querySelectorAll(".update-product-quantity-in-cart")

updateProductQuantityInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")
            const productId = e.currentTarget.getAttribute("data-product-id")
            const productPrice = parseFloat(e.currentTarget.getAttribute("data-product-price"))

            const quantityElement = e.currentTarget.parentElement.querySelector(".quantity-product-in-cart")
            let currentQuantity = parseInt(quantityElement.innerText)

            if (e.currentTarget.innerText === "+") {
                currentQuantity++
            } else {
                currentQuantity = Math.max(1, currentQuantity - 1)
            }

            quantityElement.innerText = currentQuantity

            // Update prices
            const subtotalPriceElement = e.currentTarget.parentElement.parentElement.querySelector(".subtotal-price-element")
            const totalPriceElement = document.querySelector(".total-price-element")

            const currentSubtotalPrice = currentQuantity * productPrice
            subtotalPriceElement.innerText = `$${currentSubtotalPrice}`

            const updatedSubtotalPrices = document.querySelectorAll(".subtotal-price-element")
            const newTotalPrice = Array.from(updatedSubtotalPrices).reduce((acc, elem) => acc + parseFloat(elem.innerText.replace("$", "")), 0)
            totalPriceElement.innerText = `TOTAL: $${newTotalPrice}`

            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newQuantity: currentQuantity })
            })

            if (response.ok) {
                cartUpdatedEvent()
            } else {
                throw new Error("Error updating product quantity in the cart")
            }
        } catch (error) {
            console.error(error)
        }
    })
})

// Remove a product from the cart
const deleteProductInCartBtn = document.querySelectorAll(".delete-product-in-cart")

deleteProductInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")
            const productId = e.currentTarget.getAttribute("data-product-id")
            const productTitle = e.currentTarget.getAttribute("data-product-title")

            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                localStorage.setItem("deletedProductInCart", JSON.stringify({ productTitle }))

                location.reload()
            } else {
                throw new Error("Error removing product from cart")
            }
        } catch (error) {
            throw error
        }
    })
})

// Recover deleted product from local storage for Toastify
window.addEventListener("load", () => {
    const deletedProductInCart = JSON.parse(localStorage.getItem("deletedProductInCart"))

    if (deletedProductInCart) {
        Toastify({
            text: ` "${deletedProductInCart.productTitle}" was removed from the cart.`,
            duration: 2000,
            close: false,
            position: "right",
            gravity: "bottom",
            className: "custom-toast",
        }).showToast()

        localStorage.removeItem("deletedProductInCart")
    }
})

// Remove all items from a cart
const deleteAllProductsInCartBtn = document.querySelectorAll(".delete-all-products-in-cart")

deleteAllProductsInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")

            const response = await fetch(`/api/carts/${cartId}`, {
                method: "DELETE"
            })
            
            if (response.ok) {
                localStorage.setItem("deletedAllProductsInCart", JSON.stringify({}))

                location.reload()
            } else {
                throw new Error("Error emptying the cart")
            }
        } catch (error) {
            throw error
        }
    })
})

// Recover deleted products from local storage for Toastify
window.addEventListener("load", () => {
    const deletedAllProductsInCart = JSON.parse(localStorage.getItem("deletedAllProductsInCart"))

    if (deletedAllProductsInCart) {
        Toastify({
            text: `The cart is emptied`,
            duration: 2000,
            close: false,
            position: "right",
            gravity: "bottom",
            className: "custom-toast",
        }).showToast()

        localStorage.removeItem("deletedAllProductsInCart")
    }
})

// Complete purchase
const finishPurchaseBtn = document.querySelectorAll(".finish-purchase")

finishPurchaseBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")

            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: "POST"
            })

            if (response.ok) {
                const result = await response.json()

                if (result.message) {
                    localStorage.setItem("messagePurchase", result.message)
                }
                
                if (result.error) {
                    localStorage.setItem("errorPurchase", result.error)
                }

                location.reload()
            } else {
                throw new Error("Error at checkout")
            }
        } catch (error) {
            throw error
        }
    })
})

// Recover message and error from local storage
window.addEventListener("load", () => {
    const messagePurchase = localStorage.getItem("messagePurchase")
    const errorPurchase = localStorage.getItem("errorPurchase")

    if (messagePurchase) {
        const message = document.createElement("p")
        message.className = "mb-sm-3 mb-0 text-center"
        message.innerHTML = messagePurchase
        document.querySelector(".message-session").appendChild(message)

        localStorage.removeItem("messagePurchase")
    }

    if (errorPurchase) {
        const error = document.createElement("p")
        error.className = "mb-sm-3 mb-0 text-center"
        error.innerHTML = errorPurchase
        document.querySelector(".error-session").appendChild(error)

        localStorage.removeItem("errorPurchase")
    }
})