document.addEventListener('DOMContentLoaded', function () {
    // Quantity selector functionality
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const minusBtn = selector.querySelector('.quantity-minus');
        const plusBtn = selector.querySelector('.quantity-plus');
        const input = selector.querySelector('.quantity-input');

        // Minus button click handler
        minusBtn.addEventListener('click', function () {
            let currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                triggerQuantityChange(input);
            }
        });

        // Plus button click handler
        plusBtn.addEventListener('click', function () {
            let currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            triggerQuantityChange(input);
        });

        // Input change handler
        input.addEventListener('change', function () {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
            triggerQuantityChange(this);
        });
    });

    // Function to handle quantity changes
    function triggerQuantityChange(input) {
        // You can add additional logic here when quantity changes
        // For example, update cart total or trigger animations
        console.log('Quantity changed to:', input.value);

        // Add visual feedback
        input.parentElement.classList.add('quantity-changed');
        setTimeout(() => {
            input.parentElement.classList.remove('quantity-changed');
        }, 300);
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h4').textContent;
            const itemPrice = menuItem.querySelector('.price').textContent;
            const quantity = parseInt(menuItem.querySelector('.quantity-input').value);

            // Here you would normally add to cart
            // For now we'll just show a confirmation
            showAddToCartFeedback(menuItem, itemName, quantity);

            // You would typically call your cart function here
            // addToCart(itemName, itemPrice, quantity);
        });
    });

    // Visual feedback when adding to cart
    function showAddToCartFeedback(menuItem, itemName, quantity) {
        // Add visual feedback
        const button = menuItem.querySelector('.add-to-cart');
        button.textContent = 'Added!';
        button.style.backgroundColor = '#27ae60';

        // Create confirmation message
        const confirmation = document.createElement('div');
        confirmation.className = 'add-to-cart-confirmation';
        confirmation.textContent = `${quantity}x ${itemName} added to cart`;
        menuItem.appendChild(confirmation);

        // Animate confirmation
        setTimeout(() => {
            confirmation.style.opacity = '1';
            confirmation.style.transform = 'translateY(0)';
        }, 10);

        // Reset button after animation
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '#e67e22';

            // Remove confirmation after delay
            setTimeout(() => {
                confirmation.style.opacity = '0';
                confirmation.style.transform = 'translateY(10px)';
                setTimeout(() => confirmation.remove(), 300);
            }, 2000);
        }, 1500);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Cart System
    const cart = {
        items: [],
        deliveryFee: 500,

        addItem: function (item) {
            const existingItem = this.items.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                this.items.push({ ...item });
            }
            this.updateCart();
            this.updateCartCount();
        },

        removeItem: function (id) {
            this.items = this.items.filter(item => item.id !== id);
            this.updateCart();
            this.updateCartCount();
        },

        updateQuantity: function (id, quantity) {
            const item = this.items.find(i => i.id === id);
            if (item) {
                item.quantity = quantity;
                this.updateCart();
                this.updateCartCount();
            }
        },

        calculateSubtotal: function () {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        calculateTotal: function () {
            return this.calculateSubtotal() + this.deliveryFee;
        },

        updateCart: function () {
            const cartContainer = document.querySelector('.cart-items-container');
            const emptyCartMsg = document.querySelector('.empty-cart-message');
            const cartList = document.querySelector('.cart-items-list');

            // Clear existing items
            cartContainer.innerHTML = '';

            if (this.items.length === 0) {
                emptyCartMsg.style.display = 'block';
                cartList.style.display = 'none';
                return;
            }

            emptyCartMsg.style.display = 'none';
            cartList.style.display = 'block';

            // Add items to cart
            this.items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="cart-item-quantity">
                            <button class="quantity-minus" data-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                            <button class="quantity-plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartContainer.appendChild(li);
            });

            // Update totals
            document.querySelector('.subtotal').textContent = `₦${this.calculateSubtotal().toLocaleString()}`;
            document.querySelector('.total-amount').textContent = `₦${this.calculateTotal().toLocaleString()}`;

            // Add event listeners to new elements
            this.addCartEventListeners();
        },

        updateCartCount: function () {
            const count = this.items.reduce((total, item) => total + item.quantity, 0);
            document.querySelector('.cart-count').textContent = count;
        },

        addCartEventListeners: function () {
            document.querySelectorAll('.quantity-minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const item = this.items.find(i => i.id === id);
                    if (item && item.quantity > 1) {
                        this.updateQuantity(id, item.quantity - 1);
                    }
                });
            });

            document.querySelectorAll('.quantity-plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const item = this.items.find(i => i.id === id);
                    if (item) {
                        this.updateQuantity(id, item.quantity + 1);
                    }
                });
            });

            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const quantity = parseInt(e.target.value);
                    if (!isNaN(quantity)) {
                        this.updateQuantity(id, Math.max(1, quantity));
                    }
                });
            });

            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    this.removeItem(id);
                });
            });
        },

        init: function () {
            this.updateCart();
            this.updateCartCount();

            // Proceed to payment button
            const paymentBtn = document.querySelector('.proceed-to-payment');
            if (paymentBtn) {
                paymentBtn.addEventListener('click', () => {
                    if (this.items.length > 0) {
                        document.querySelector('#payment').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    };

    // Initialize cart
    cart.init();

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            if (this.disabled) {
                const itemName = this.closest('.menu-item').querySelector('h4').textContent;
                alert(`We'll notify you when ${itemName} is available!`);
                return;
            }

            const menuItem = this.closest('.menu-item');
            const id = menuItem.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '-');
            const name = menuItem.querySelector('h4').textContent;
            const price = parseInt(menuItem.querySelector('.price').textContent.replace(/[^\d]/g, ''));
            const quantityInput = menuItem.querySelector('.quantity-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            cart.addItem({
                id,
                name,
                price,
                quantity
            });

            // Show feedback
            const feedback = document.createElement('div');
            feedback.className = 'add-to-cart-feedback';
            feedback.textContent = `${quantity}x ${name} added to cart`;
            menuItem.appendChild(feedback);

            setTimeout(() => {
                feedback.classList.add('show');
                setTimeout(() => {
                    feedback.classList.remove('show');
                    setTimeout(() => feedback.remove(), 300);
                }, 2000);
            }, 10);
        });
    });

    // Add styles for feedback
    const style = document.createElement('style');
    style.textContent = `
        .add-to-cart-feedback {
            position: absolute;
            bottom: -35px;
            left: 0;
            right: 0;
            background: #27ae60;
            color: white;
            padding: 8px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 0.9rem;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            z-index: 10;
        }
        .add-to-cart-feedback.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// Scroll Animation Script
document.addEventListener('DOMContentLoaded', function () {
    // Function to check if element is in viewport
    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0
        );
    }

    // Function to handle scroll animations
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        animatedElements.forEach(element => {
            if (isInViewport(element, 100)) {
                const animationType = element.getAttribute('data-animate');
                element.style.visibility = 'visible';
                element.classList.add(`animate-${animationType}`);
            }
        });
    }

    // Add animation classes to elements
    function setupAnimations() {
        // Sections that should animate
        const sectionsToAnimate = [
            '#menu',
            '#about',
            '#gallery',
            '#contact',
            '.menu-item',
            '.feature',
            '.gallery-item'
        ];

        sectionsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.setAttribute('data-animate', 'fadeInUp');
                element.style.visibility = 'hidden';
                element.style.transition = 'all 0.6s ease-out';

                // Add delay based on index for staggered animations
                if (selector === '.menu-item' || selector === '.feature' || selector === '.gallery-item') {
                    element.style.transitionDelay = `${index * 0.1}s`;
                }
            });
        });

        // Special animation for hero text
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.setAttribute('data-animate', 'fadeIn');
            heroText.style.visibility = 'hidden';
        }

        // Add CSS animation classes
        const style = document.createElement('style');
        style.textContent = `
            .animate-fadeIn {
                animation: fadeIn 0.8s ease-out forwards;
            }
            
            .animate-fadeInUp {
                animation: fadeInUp 0.8s ease-out forwards;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Slide animations for menu categories */
            .animate-slideInLeft {
                animation: slideInLeft 0.6s ease-out forwards;
            }
            
            .animate-slideInRight {
                animation: slideInRight 0.6s ease-out forwards;
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize animations
    setupAnimations();

    // Run once on load
    handleScrollAnimations();

    // Run on scroll
    window.addEventListener('scroll', function () {
        handleScrollAnimations();
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function () {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
});