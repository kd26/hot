class SearchEngine {
    constructor() {
        this.products = {
            'dress-1': { id: 'dress-1', name: 'Botanical Garden Dress', price: 3200, material: 'Cotton', image: 'product-dress-1.jpg', category: 'fashion', type: 'dress', print: 'floral', description: 'Cotton handblock print dress with botanical garden design' },
            'dress-2': { id: 'dress-2', name: 'Sage Geometry Dress', price: 4500, material: 'Linen', image: 'product-dress-2.jpg', category: 'fashion', type: 'dress', print: 'geometric', description: 'Linen dress with traditional geometric print in sage tones' },
            'dress-3': { id: 'dress-3', name: 'Heritage Block Dress', price: 3800, material: 'Cotton', image: 'product-dress-3.jpg', category: 'fashion', type: 'dress', print: 'block', description: 'Cotton dress with traditional block print heritage design' },
            'dress-4': { id: 'dress-4', name: 'Royal Indigo Dress', price: 5200, material: 'Silk', image: 'product-dress-4.jpg', category: 'fashion', type: 'dress', print: 'geometric', description: 'Silk dress with royal indigo geometric pattern' },
            'scarf-1': { id: 'scarf-1', name: 'Lotus Bloom Scarf', price: 2800, material: 'Silk', image: 'product-scarf-1.jpg', category: 'fashion', type: 'scarf', print: 'floral', description: 'Silk scarf with floral embroidery featuring lotus bloom design' },
            'scarf-2': { id: 'scarf-2', name: 'Meadow Whisper Scarf', price: 2200, material: 'Linen', image: 'product-scarf-2.jpg', category: 'fashion', type: 'scarf', print: 'floral', description: 'Linen scarf with delicate floral meadow whisper pattern' },
            'runner-1': { id: 'runner-1', name: 'Botanical Garden Runner', price: 1800, material: 'Linen', image: 'table-runner-1.jpg', category: 'lifestyle', type: 'table-linen', description: 'Linen table runner with handblock botanical garden print' },
            'cushion-1': { id: 'cushion-1', name: 'Meadow Bloom Cushion', price: 1200, material: 'Cotton', image: 'cushion-1.jpg', category: 'lifestyle', type: 'cushions', description: 'Cotton cushion cover with floral embroidery meadow bloom design' },
            'cushion-2': { id: 'cushion-2', name: 'Indigo Geometry Cushion', price: 1400, material: 'Linen', image: 'cushion-2.jpg', category: 'lifestyle', type: 'cushions', description: 'Linen cushion cover with indigo geometry block print' },
            'napkins-1': { id: 'napkins-1', name: 'Sage Leaf Napkin Set', price: 1600, material: 'Linen', image: 'napkin-set.jpg', category: 'lifestyle', type: 'table-linen', description: 'Linen napkin set of 4 with sage leaf design' },
            'placemats-1': { id: 'placemats-1', name: 'Heritage Placemat Set', price: 2200, material: 'Cotton', image: 'placemat-set.jpg', category: 'lifestyle', type: 'runners', description: 'Cotton placemat set of 6 with traditional heritage print' },
            'tablecloth-1': { id: 'tablecloth-1', name: 'Natural Harmony Tablecloth', price: 3500, material: 'Linen', image: 'tablecloth.jpg', category: 'lifestyle', type: 'table-linen', description: 'Linen tablecloth with minimalist natural harmony design' }
        };
        this.bindSearchEvents();
    }

    bindSearchEvents() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const closeSearch = document.getElementById('close-search');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.trim().length > 0) {
                    this.performSearch(e.target.value.trim());
                } else {
                    this.hideSearchResults();
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value.trim());
                }
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchInput?.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });
        }

        if (closeSearch) {
            closeSearch.addEventListener('click', () => {
                this.hideSearchResults();
                if (searchInput) searchInput.value = '';
            });
        }
    }

    performSearch(query) {
        const results = this.searchProducts(query);
        this.displaySearchResults(results, query);
    }

    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        const results = [];

        Object.values(this.products).forEach(product => {
            let score = 0;
            const searchFields = [
                { field: product.name, weight: 3 },
                { field: product.description, weight: 2 },
                { field: product.material, weight: 2 },
                { field: product.type, weight: 2 },
                { field: product.print, weight: 1 },
                { field: product.category, weight: 1 }
            ];

            searchFields.forEach(({ field, weight }) => {
                if (field && field.toLowerCase().includes(lowercaseQuery)) {
                    score += weight;
                }
            });

            if (score > 0) {
                results.push({ product, score });
            }
        });

        return results.sort((a, b) => b.score - a.score).map(item => item.product);
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('search-results');
        const searchResultsContent = document.getElementById('search-results-content');

        if (!searchResults || !searchResultsContent) return;

        if (results.length === 0) {
            searchResultsContent.innerHTML = `
                <div class="no-results">
                    <p>No products found for "${query}"</p>
                    <p>Try searching for dresses, scarves, cushions, table linen, or materials like cotton, linen, silk</p>
                </div>
            `;
        } else {
            searchResultsContent.innerHTML = results.map(product => `
                <a href="${product.category === 'fashion' ? 'catalog.html' : 'lifestyle.html'}" class="search-result-item">
                    <img src="images/${product.image}" alt="${product.name}" class="search-result-image">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <p>${product.material} • ${product.category === 'fashion' ? 'Fashion' : 'Lifestyle'}</p>
                        <p class="search-result-price">₹${product.price.toLocaleString()}</p>
                    </div>
                </a>
            `).join('');
        }

        searchResults.classList.remove('hidden');
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.classList.add('hidden');
        }
    }
}

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
    const search = new SearchEngine();
    
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