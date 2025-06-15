document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Define products
    const products = [
        {
            id: 1,
            name: "Black Label",
            price: 3500,
            image: "images/blackl.jpg",
            category: "whiskey"
        },
        {
            id: 2,
            name: "Jack Daniels",
            price: 3700,
            image: "images/jack1.jpg",
            category: "whiskey"
        },
        {
            id: 3,
            name: "Best Whiskey",
            price: 1500,
            image: "https://via.placeholder.com/300x400?text=Trace+Whiskey",
            category: "whiskey"
        },
        {
            id: 4,
            name: "KC Pineapple",
            price: 900,
            image: "https://kcbl.co.tz/wp-content/uploads/2021/06/KC-Pineapple-Flavor.png",
            category: "flavored"
        },
        {
            id: 5,
            name: "KC Ginger & Lemon",
            price: 900,
            image: "https://kcbl.co.tz/wp-content/uploads/2021/06/KC-Ginger-Lemon-Flavor.png",
            category: "flavored"
        },
        {
            id: 6,
            name: "Chrome Gin",
            price: 800,
            image: "https://via.placeholder.com/300x400?text=Chrome+Gin",
            category: "gin"
        },
        {
            id: 7,
            name: "Hunters Whiskey",
            price: 1200,
            image: "https://via.placeholder.com/300x400?text=Premium+Whiskey",
            category: "whiskey"
        },
        {
            id: 8,
            name: "County",
            price: 900,
            image: "https://via.placeholder.com/300x400?text=Premium+Gin",
            category: "gin"
        },
        {
            id: 9,
            name: "White Cap",
            price: 300,
            image: "https://via.placeholder.com/300x400?text=Premium+Beer",
            category: "beer"
        }
    ];

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Render products
    function renderProducts() {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">Ksh ${product.price.toLocaleString()}</div>
                    <button class="add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-image="${product.image}">
                        Add to Cart
                    </button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
        
        // Add event listeners to all add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = parseInt(this.getAttribute('data-price'));
                const image = this.getAttribute('data-image');
                
                addToCart(id, name, price, image);
            });
        });
    }
    
    // Add item to cart
    function addToCart(id, name, price, image) {
        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(`${name} added to cart!`);
    }
    
    // Remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }
    
    // Update cart in localStorage and UI
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
    
    // Render cart
    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Start shopping to add items!</p>';
            cartTotalElement.textContent = '0';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">Kshs ${item.price.toLocaleString()}</div>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        cartTotalElement.textContent = total.toLocaleString();
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCart();
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Initialize cart
    function initializeCart() {
        renderCart();
        
        // Checkout button event
        document.getElementById('checkout-btn').addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty. Please add items before checkout.');
                return;
            }
            document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize the app
    renderProducts();
    initializeCart();
});