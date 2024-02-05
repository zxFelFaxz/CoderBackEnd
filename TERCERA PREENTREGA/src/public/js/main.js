// Widget for products in the shopping cart
document.addEventListener("DOMContentLoaded", async () => {
    const cartWidget = document.querySelector(".btn-cart-widget")
    const cartId = cartWidget.getAttribute("data-cart-id")
    
    const updateCartCounter = async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}`)

            if (!response.ok) {
                throw new Error("Error getting the cart")
            }

            const data = await response.json()

            const totalProductsInCart = data.data.products.reduce((acc, product) => acc + product.quantity, 0)

            const cartCounter = cartWidget.querySelector(".counter-cart-widget")

            if (totalProductsInCart > 0) {
                cartCounter.classList.remove("d-none")
                cartCounter.innerHTML = totalProductsInCart
            } else {
                cartCounter.classList.add("d-none")
            }
        } catch (error) {
            throw error
        }
    }

    updateCartCounter(cartId)
    document.addEventListener("cartUpdated", updateCartCounter)
})

// Class conditional according to product category (for styles)
const categoryInfo = document.querySelectorAll("[data-category]")

categoryInfo.forEach((cat) => {
    const category = cat.getAttribute("data-category")
    
    if (category === "vegetarian") {
        cat.classList.add("vegetarian-category-card")
    } else if (category === "vegan") {
        cat.classList.add("vegan-category-card")
    }
})