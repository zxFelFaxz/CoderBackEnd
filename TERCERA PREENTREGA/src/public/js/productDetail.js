// Start event CartUpdated
const cartUpdatedEvent = () => {
    document.dispatchEvent(new Event("cartUpdated"))
}

// Counter
const countProductDetail = document.querySelectorAll(".count-product-detail")

countProductDetail.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const countQuantityElement = e.currentTarget.parentElement.querySelector(".count-quantity-product-detail")
            let countCurrentQuantity = parseInt(countQuantityElement.innerText)

            if (e.currentTarget.innerText === "+") {
                countCurrentQuantity++
            } else {
                countCurrentQuantity = Math.max(1, countCurrentQuantity - 1)
            }

            countQuantityElement.innerText = countCurrentQuantity
        } catch (error) {
            throw error
        }
    })
})

// Add product to cart
const addToCartBtn = document.querySelectorAll(".btn-add-to-cart")

addToCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id")
            const productId = e.currentTarget.getAttribute("data-product-id")
            const productTitle = e.currentTarget.getAttribute("data-product-title")
            const userRole = e.currentTarget.getAttribute("data-user-role")

            if (userRole == "admin") {
                Toastify({
                    text: `An admin cannot add products to the cart`,
                    duration: 2000,
                    close: false,
                    position: "right",
                    gravity: "bottom",
                    className: "custom-toast"
                }).showToast()
            } else {
                // Get the amount of the counter
                const countQuantityElement = e.currentTarget.parentElement.querySelector(".count-quantity-product-detail")
                const countCurrentQuantity = parseInt(countQuantityElement.innerText)

                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: countCurrentQuantity
                    })
                })

                if (response.ok) {
                    Toastify({
                        text: ` ${countCurrentQuantity} "${productTitle.toLowerCase()}" added to cart`,
                        duration: 2000,
                        close: false,
                        position: "right",
                        gravity: "bottom",
                        className: "custom-toast"
                    }).showToast()

                    cartUpdatedEvent()
                } else {
                    throw new Error("Error adding product to cart")
                }
            }
        } catch (error) {
            throw error
        }
    })
})