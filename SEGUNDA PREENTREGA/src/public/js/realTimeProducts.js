const socketClient = io()

// Obtain products
const cardProductsContainer = document.getElementById("cardProductsContainer")

socketClient.on("productsArray", (productsData) => {
    if (productsData.length > 0) {
        cardProductsContainer.innerHTML = `
            <h1 class="title-category">MENU</h1>
            <div>
                <div class="item-list">
        `

        productsData.forEach((product) => {
            let cardProduct = `
                <div class="card-list">
                    <a href="/products/${product._id}">
                        <div class="card">
            `

            if (product.thumbnail) {
                cardProduct += `
                    <img class="card-img-top" src="/assets/imgProducts/${product.thumbnail}" alt="${product.title}">
                `
            }

            cardProduct += `
                        <div class="card-body row justify-content-evenly">
                            <h5 class="card-title mb-3">${product.title}</h5>
                            <p class="col-auto text-card-list">$${product.price}</p>
                            <p class="col-auto text-card-list category-card" data-category="${product.category}">
                                ${product.category}
                            </p>
                        </div>
                    </div>
                </a>
                <button class="btn-delete-product" data-product-id="${product._id}">Eliminar</button>
            `

            cardProductsContainer.querySelector(".item-list").innerHTML += cardProduct
        })

        cardProductsContainer.innerHTML += `</div></div></div>`

        // Delete products
        const deleteProductBtn = document.querySelectorAll(".btn-delete-product")

        deleteProductBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-product-id")
                if (confirm("Do you want to remove this product?")) {
                    socketClient.emit("deleteProduct", productId)
                }
            })
        })

        // Class conditional according to product category for styles
        const categoryInfo = document.querySelectorAll("[data-category]")

        categoryInfo.forEach((cat) => {
            const category = cat.getAttribute("data-category")
            
            if (category === "vegetarian") {
                cat.classList.add("vegetarian-category-card")
            } else if (category === "vegan") {
                cat.classList.add("vegan-category-card")
            }
        })
    } else {
        cardProductsContainer.innerHTML = `
            <h1 class="title-category">MENU</h1>
            <h2 class="title-category">Could not load menu</h2>
        `
    }
})

// Add products
const addProductForm = document.getElementById("addProductForm")

addProductForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(addProductForm)
    const jsonData = {}

    for (const [key, value] of formData.entries()) {
        jsonData[key] = value
    }
    
    socketClient.emit("addProduct", jsonData)
    addProductForm.reset()
})