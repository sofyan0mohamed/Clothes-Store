// Products Data with Egyptian Market Pricing
const products = [
    {
        id: 1,
        name: "فستان أنيق للنساء",
        category: "women",
        price: 450,
        originalPrice: 600,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "جديد"
    },
    {
        id: 2,
        name: "قميص رجالي كلاسيك",
        category: "men",
        price: 280,
        originalPrice: 350,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "خصم"
    },
    {
        id: 3,
        name: "جينز نسائي عريض",
        category: "women",
        price: 320,
        originalPrice: 400,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "الأكثر مبيعاً"
    },
    {
        id: 4,
        name: "جاكيت رجالي شتوي",
        category: "men",
        price: 580,
        originalPrice: 750,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "موسمي"
    },
    {
        id: 5,
        name: "ملابس أطفال رياضية",
        category: "kids",
        price: 180,
        originalPrice: 220,
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "عرض خاص"
    },
    {
        id: 6,
        name: "بلوزة نسائية أنيقة",
        category: "women",
        price: 220,
        originalPrice: 280,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "جديد"
    },
    {
        id: 7,
        name: "بنطلون رجالي رسمي",
        category: "men",
        price: 350,
        originalPrice: 420,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "كلاسيك"
    },
    {
        id: 8,
        name: "فستان أطفال جميل",
        category: "kids",
        price: 150,
        originalPrice: 190,
        image: "https://images.unsplash.com/photo-1553451191-6d8fcdc0ba6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "عرض"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
        });
    });

    // Modal close
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeCart);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCart();
        }
    });

    // Contact form
    contactForm.addEventListener('submit', handleContactForm);
}

// Display products
function displayProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <div class="product-price">
                    <span class="current-price">${product.price} جنيه</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">${product.originalPrice} جنيه</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> أضف للسلة
                </button>
            </div>
        </div>
    `).join('');
}

// Filter products
function filterProducts(category) {
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Display filtered products
    displayProducts(category);
}

// Get category name in Arabic
function getCategoryName(category) {
    const categories = {
        'women': 'ملابس نسائية',
        'men': 'ملابس رجالية',
        'kids': 'ملابس أطفال'
    };
    return categories[category] || category;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartDisplay();
    showNotification('تم إضافة المنتج إلى السلة بنجاح!');
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} جنيه</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white;">×</button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('تم حذف المنتج من السلة');
}

// Open cart modal
function openCart() {
    cartModal.style.display = 'block';
    updateCartDisplay();
}

// Close cart modal
function closeCart() {
    cartModal.style.display = 'none';
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`إجمالي الطلب: ${total} جنيه مصري\nسيتم التواصل معك قريباً لإتمام عملية الشراء`);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    closeCart();
}

// Handle contact form
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Contact form data:', data);
    
    showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
    event.target.reset();
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search functionality
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        getCategoryName(product.category).toLowerCase().includes(searchTerm)
    );
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <div class="product-price">
                    <span class="current-price">${product.price} جنيه</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">${product.originalPrice} جنيه</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> أضف للسلة
                </button>
            </div>
        </div>
    `).join('');
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}); 