class CartPage {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartCount();
        this.bindEvents();
    }

    bindEvents() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }

        // Bind quantity and remove events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const productId = e.target.getAttribute('data-product');
                const action = e.target.getAttribute('data-action');
                this.updateQuantity(productId, action);
            }

            if (e.target.classList.contains('remove-btn')) {
                const productId = e.target.getAttribute('data-product');
                this.removeItem(productId);
            }
        });
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartContainer = document.getElementById('empty-cart');

        if (this.cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCartContainer.style.display = 'block';
            document.querySelector('.cart-summary').style.display = 'none';
            return;
        }

        cartItemsContainer.style.display = 'block';
        emptyCartContainer.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'block';

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="images/${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="material">${item.material}</div>
                    <div class="price">₹${item.price.toLocaleString()}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-product="${item.id}" data-action="decrease" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" data-product="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-btn" data-product="${item.id}" title="Remove item">🗑️</button>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateQuantity(productId, action) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
        }

        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }

    removeItem(productId) {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    updateSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over ₹5000
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
        document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty. Please add some items before checkout.');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = total > 5000 ? 0 : 200;
        const finalTotal = total + shipping;

        // For now, just show an alert. In a real application, this would redirect to a payment gateway
        alert(`Thank you for your order!\n\nOrder Summary:\nSubtotal: ₹${total.toLocaleString()}\nShipping: ${shipping === 0 ? 'Free' : '₹' + shipping}\nTotal: ₹${finalTotal.toLocaleString()}\n\nYou will be redirected to the payment page.`);
        
        // Clear cart after successful checkout
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
});