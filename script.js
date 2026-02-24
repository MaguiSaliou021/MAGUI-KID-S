let cart = JSON.parse(localStorage.getItem('m2m-cart')) || [];
let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

const cartDisplay = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const form = document.getElementById("contact-form");
const searchInput = document.getElementById("search-input");
const productCards = document.querySelectorAll(".product-card");

document.addEventListener("DOMContentLoaded", () => {
    updateCart();
    setupAddToCartButtons();
    setupSearch();
    setupNavbarScroll();
    setupCategoryFilter();
});

function setupAddToCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseInt(button.getAttribute("data-price"));
            
            addToCart(name, price);
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    saveCart();
    updateCart();
    showToast(name);
}

function saveCart() {
    localStorage.setItem('m2m-cart', JSON.stringify(cart));
}

function updateCart() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartDisplay.textContent = cartCount;
    
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i>🛒</i>
                <p>Votre panier est vide</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <li class="cart-item">
                <div class="cart-item-info">
                    <h6>${item.name}</h6>
                    <small>${item.price} FCFA</small>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <span class="remove-item" onclick="removeItem(${index})">🗑️</span>
            </li>
        `).join('');
    }
    
    cartTotal.textContent = total;
}

function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

clearCartBtn.addEventListener("click", () => {
    if (cart.length > 0) {
        if (confirm("Voulez-vous vraiment vider le panier?")) {
            cart = [];
            saveCart();
            updateCart();
        }
    }
});

function closeCartModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) {
        modal.hide();
    }
}

function showToast(productName) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon">✅</div>
        <div class="toast-content">
            <h6>Ajouté au panier!</h6>
            <small>${productName}</small>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function setupSearch() {
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        productCards.forEach(card => {
            const productName = card.querySelector('h5').textContent.toLowerCase();
            
            if (productName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    
    if (name && email) {
        showFormSuccess();
        form.reset();
    }
});

function showFormSuccess() {
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-success form-alert';
    alert.style.borderRadius = '10px';
    alert.style.marginTop = '1rem';
    alert.textContent = 'Merci pour votre message! Nous vous répondrons bientôt. ❤️';
    
    form.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function setupCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productItems = document.querySelectorAll('.product-item');
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            productItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                    item.classList.add('show');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('show');
                }
            });
        });
    });
}
