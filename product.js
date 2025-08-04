document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const quantitySpan = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const addToCartBtn = document.getElementById('add-to-cart');
    
    let selectedSize = 'M';
    let quantity = 1;

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            mainImage.src = thumbnail.src;
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedSize = button.getAttribute('data-size');
        });
    });

    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantitySpan.textContent = quantity;
        }
    });

    increaseBtn.addEventListener('click', () => {
        quantity++;
        quantitySpan.textContent = quantity;
    });

    addToCartBtn.addEventListener('click', () => {
        const productData = {
            id: 'dress-1',
            name: 'Botanical Garden Dress',
            price: 3200,
            size: selectedSize,
            quantity: quantity,
            image: mainImage.src
        };

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => 
            item.id === productData.id && item.size === productData.size
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += productData.quantity;
        } else {
            cart.push(productData);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;

        addToCartBtn.textContent = 'Added to Cart!';
        addToCartBtn.style.backgroundColor = '#73614A';
        
        setTimeout(() => {
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.style.backgroundColor = '#8B7355';
        }, 2000);
    });

    const relatedItems = document.querySelectorAll('.related-item');
    relatedItems.forEach(item => {
        item.addEventListener('click', () => {
            window.location.href = 'product.html';
        });
    });
});