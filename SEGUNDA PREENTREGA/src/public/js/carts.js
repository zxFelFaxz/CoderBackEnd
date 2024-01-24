// Send event cartUpdated
const cartUpdatedEvent = () => {
    document.dispatchEvent(new Event("cartUpdated"));
}

// Update quantity of products in the shopping cart
const updateProductQuantityInCartBtn = document.querySelectorAll(".update-product-quantity-in-cart");

updateProductQuantityInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id");
            const productId = e.currentTarget.getAttribute("data-product-id");
            const productPrice = parseFloat(e.currentTarget.getAttribute("data-product-price"));
            const quantityElement = e.currentTarget.parentElement.querySelector(".quantity-product-in-cart");
            let currentQuantity = parseInt(quantityElement.innerText);

            if (e.currentTarget.innerText === "+") {
                currentQuantity++;
            } else {
                currentQuantity = Math.max(1, currentQuantity - 1);
            }

            quantityElement.innerText = currentQuantity;

            // Update prices
            const subtotalPriceElement = e.currentTarget.parentElement.parentElement.querySelector(".subtotal-price-element");
            const totalPriceElement = document.querySelector(".total-price-element");
            const currentSubtotalPrice = currentQuantity * productPrice;
            subtotalPriceElement.innerText = `$${currentSubtotalPrice}`;
            const updatedSubtotalPrices = document.querySelectorAll(".subtotal-price-element");
            const newTotalPrice = Array.from(updatedSubtotalPrices).reduce((acc, elem) => acc + parseFloat(elem.innerText.replace("$", "")), 0);
            totalPriceElement.innerText = `TOTAL: $${newTotalPrice}`;

            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newQuantity: currentQuantity })
            });

            if (response.ok) {
                cartUpdatedEvent();
            } else {
                throw new Error("Error updating product quantity in the cart");
            }
        } catch (error) {
            console.error(error);
        }
    });
});

// Remove a product from the cart
const deleteProductInCartBtn = document.querySelectorAll(".delete-product-in-cart");

deleteProductInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id");
            const productId = e.currentTarget.getAttribute("data-product-id");
            const productTitle = e.currentTarget.getAttribute("data-product-title");
            
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                localStorage.setItem("deletedProductInCart", JSON.stringify({ productTitle }));

                location.reload();
            } else {
                throw new Error("Error deleting product from the cart");
            }
        } catch (error) {
            throw error;
        }
    });
});

// Remove all products from a cart
const deleteAllProductsInCartBtn = document.querySelectorAll(".delete-all-products-in-cart");

deleteAllProductsInCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id");

            const response = await fetch(`/api/carts/${cartId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                localStorage.setItem("deletedAllProductsInCart", JSON.stringify({}));

                location.reload();
            } else {
                throw new Error("Error clearing the cart");
            }
        } catch (error) {
            throw error;
        }
    });
});

// Complete your purchase
const finishPurchaseBtn = document.querySelectorAll(".finish-purchase");

finishPurchaseBtn.forEach(async (btn) => {
    btn.addEventListener("click", async (e) => {
        try {
            const cartId = e.currentTarget.getAttribute("data-cart-id");

            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: "POST"
            });

            if (response.ok) {
                const result = await response.json();

                if (result.message) {
                    localStorage.setItem("messagePurchase", result.message);
                }

                if (result.error) {
                    localStorage.setItem("errorPurchase", result.error);
                }

                location.reload();
            } else {
                throw new Error("Error completing the purchase");
            }
        } catch (error) {
            throw error;
        }
    });
});