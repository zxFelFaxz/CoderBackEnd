// Conditional of classes according to product category for styles
const categoryInfo = document.querySelectorAll("[data-category]")

categoryInfo.forEach((cat) => {
    const category = cat.getAttribute("data-category")
    
    if (category === "vegetarian") {
        cat.classList.add("vegetarian-category-card")
    } else if (category === "vegan") {
        cat.classList.add("vegan-category-card")
    }
})