// Add product to cart
const addToCartBtn = document.querySelectorAll(".btn-add-to-cart")

addToCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        const cartId = "65864fede228d8d0b8c642fe" 
        const productId = e.target.getAttribute("data-product-id")
        const productTitle = e.target.getAttribute("data-product-title")

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST"
        })
        
        if (response.status === 200) {
            alert(`"${productTitle}" ADDED TO CART`)
        } else {
            throw new Error("Error adding product to cart")
        }
    })
})