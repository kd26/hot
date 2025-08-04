class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.getAttribute('data-product');
                this.addToCart(productId);
            }
        });

        const filterElements = document.querySelectorAll('#material-filter, #print-filter, #category-filter');
        filterElements.forEach(filter => {
            filter.addEventListener('change', () => this.filterProducts());
        });
    }

    addToCart(productId) {
        const products = {
            'dress-1': { id: 'dress-1', name: 'Botanical Garden Dress', price: 3200, material: 'Cotton', image: 'product-dress-1.jpg' },
            'dress-2': { id: 'dress-2', name: 'Sage Geometry Dress', price: 4500, material: 'Linen', image: 'product-dress-2.jpg' },
            'dress-3': { id: 'dress-3', name: 'Heritage Block Dress', price: 3800, material: 'Cotton', image: 'product-dress-3.jpg' },
            'dress-4': { id: 'dress-4', name: 'Royal Indigo Dress', price: 5200, material: 'Silk', image: 'product-dress-4.jpg' },
            'scarf-1': { id: 'scarf-1', name: 'Lotus Bloom Scarf', price: 2800, material: 'Silk', image: 'product-scarf-1.jpg' },
            'scarf-2': { id: 'scarf-2', name: 'Meadow Whisper Scarf', price: 2200, material: 'Linen', image: 'product-scarf-2.jpg' },
            'runner-1': { id: 'runner-1', name: 'Botanical Garden Runner', price: 1800, material: 'Linen', image: 'table-runner-1.jpg' },
            'cushion-1': { id: 'cushion-1', name: 'Meadow Bloom Cushion', price: 1200, material: 'Cotton', image: 'cushion-1.jpg' },
            'cushion-2': { id: 'cushion-2', name: 'Indigo Geometry Cushion', price: 1400, material: 'Linen', image: 'cushion-2.jpg' },
            'napkins-1': { id: 'napkins-1', name: 'Sage Leaf Napkin Set', price: 1600, material: 'Linen', image: 'napkin-set.jpg' },
            'placemats-1': { id: 'placemats-1', name: 'Heritage Placemat Set', price: 2200, material: 'Cotton', image: 'placemat-set.jpg' },
            'tablecloth-1': { id: 'tablecloth-1', name: 'Natural Harmony Tablecloth', price: 3500, material: 'Linen', image: 'tablecloth.jpg' }
        };

        const product = products[productId];
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAddToCartFeedback();
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    showAddToCartFeedback() {
        const feedback = document.createElement('div');
        feedback.textContent = 'Added to cart!';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #8B7355;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    filterProducts() {
        const materialFilter = document.getElementById('material-filter')?.value || '';
        const printFilter = document.getElementById('print-filter')?.value || '';
        const categoryFilter = document.getElementById('category-filter')?.value || '';
        
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const material = card.getAttribute('data-material') || '';
            const print = card.getAttribute('data-print') || '';
            const category = card.getAttribute('data-category') || '';
            
            const materialMatch = !materialFilter || material === materialFilter;
            const printMatch = !printFilter || print === printFilter;
            const categoryMatch = !categoryFilter || category === categoryFilter;
            
            if (materialMatch && printMatch && categoryMatch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cart = new ShoppingCart();
    
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.querySelector('.product-categories').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }

    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = link.getAttribute('href');
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(300px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);