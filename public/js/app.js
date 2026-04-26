// --- INITIAL STATE ---
// Changed 'currentUser' to 'userRole' to match your login.html logic
let currentRole = localStorage.getItem('userRole'); 
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let activeProductModal = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuthGuard();
    updateNavUI();
    updateCartBadge();
});

// 1. AUTH GUARD: Protects pages based on role
function checkAuthGuard() {
    const path = window.location.pathname;
    
    // If not logged in and not on login page, send to login
    if (!currentRole && !path.includes('login.html')) {
        window.location.href = 'login.html';
    }
    
    // If trying to access admin.html without admin role, send to home
    if (currentRole !== 'admin' && path.includes('admin.html')) {
        window.location.href = 'index.html';
    }
}

// 2. NAV UI: Updates navigation visibility
function updateNavUI() {
    const adminBtn = document.getElementById('nav-dashboard'); // Changed ID to match your navbar
    const logoutBtn = document.getElementById('nav-logout');
    const loginLink = document.getElementById('nav-login');

    if (currentRole === 'admin') {
        if (adminBtn) adminBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (loginLink) loginLink.classList.add('hidden');
    } else if (currentRole === 'guest') {
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (loginLink) loginLink.classList.add('hidden');
    }
}

// 3. LOGOUT: Clears session
function logout() {
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}

// 4. PRODUCT MODAL LOGIC: Displays detail view
function showProductDetails(prodStr) {
    const prod = JSON.parse(decodeURIComponent(prodStr));
    activeProductModal = prod;
    
    // Select elements (make sure these IDs exist in your modal HTML)
    document.getElementById('modal-img').src = prod.image || 'images/placeholder.jpg';
    document.getElementById('modal-title').innerText = prod.title;
    document.getElementById('modal-category').innerText = prod.category;
    document.getElementById('modal-desc').innerText = prod.description || 'Handcrafted with heritage techniques.';
    document.getElementById('modal-price').innerText = `€${prod.price.toFixed(2)}`;
    
    const btn = document.getElementById('modal-add-btn');
    if (prod.stock > 0) {
        btn.disabled = false;
        btn.innerHTML = 'Add to Cart';
        btn.className = 'w-full bg-stone-900 text-white font-bold py-3 uppercase text-xs tracking-widest hover:bg-stone-800 transition mt-6';
    } else {
        btn.disabled = true;
        btn.innerHTML = 'Out of Stock';
        btn.className = 'w-full bg-stone-200 text-stone-500 font-bold py-3 uppercase text-xs tracking-widest cursor-not-allowed mt-6';
    }
    
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

function addModalToCart() {
    if (activeProductModal) {
        addToCart(activeProductModal);
        closeProductModal();
    }
}

// 5. CART LOGIC
function addToCart(prod) {
    const existing = cart.find(item => item.id === prod.id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...prod, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    alert(`Added ${prod.title} to your tray!`);
}

function updateCartBadge() {
    const badge = document.getElementById('nav-cart-count'); // Matches your HTML ID
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.innerText = `(${totalItems})`;
    }
}

function checkout() {
    if(!cart.length) return alert('Your tray is empty!');
    cart = []; 
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge(); 
    alert('Thank you! Your artisan order is being prepared.');
    window.location.href = 'index.html';
}