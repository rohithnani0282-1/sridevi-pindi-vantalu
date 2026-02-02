// Pindi Vantalu Website JavaScript

// Data Management
let menuItems = [];
let nextId = 1;

// Cart Management
let cart = [];
const CART_KEY = 'pindiVantaluCart';

// Authentication
let isAuthenticated = false;
let adminCredentials = {
    username: 'admin',
    password: 'admin123'
};
const CREDENTIALS_KEY = 'pindiVantaluAdminCredentials';
const SESSION_KEY = 'pindiVantaluAdminSession';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const logoutBtn = document.getElementById('logoutBtn');
const addItemForm = document.getElementById('addItemForm');
const adminItemsList = document.getElementById('adminItemsList');
const editModal = document.getElementById('editModal');
const editItemForm = document.getElementById('editItemForm');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Cart Elements
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Login Modal Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Credentials Form Elements
const updateCredentialsForm = document.getElementById('updateCredentialsForm');
const currentPasswordInput = document.getElementById('currentPassword');
const newUsernameInput = document.getElementById('newUsername');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();
    loadCredentials();
    loadCart();
    renderMenuItems();
    checkAuthentication();
    setupEventListeners();
});

// Load menu items from localStorage
function loadMenuItems() {
    const storedItems = localStorage.getItem('pindiVantaluItems');
    if (storedItems) {
        menuItems = JSON.parse(storedItems);
        nextId = Math.max(...menuItems.map(item => item.id), 0) + 1;
    } else {
        // Load default items if no stored items
        loadDefaultItems();
    }
}

// Load default Pindi Vantalu items
function loadDefaultItems() {
    menuItems = [
        {
            id: nextId++,
            name: 'Avakaya Pickle',
            price: 120,
            description: 'Spicy mango pickle made with raw mangoes and traditional Andhra spices',
            category: 'pickles'
        },
        {
            id: nextId++,
            name: 'Gongura Pickle',
            price: 100,
            description: 'Tangy sorrel leaves pickle, a classic Andhra delicacy',
            category: 'pickles'
        },
        {
            id: nextId++,
            name: 'Allam Pickle',
            price: 80,
            description: 'Aromatic ginger pickle with lemon and spices',
            category: 'pickles'
        },
        {
            id: nextId++,
            name: 'Kaja',
            price: 60,
            description: 'Traditional sweet layered pastry with sugar syrup',
            category: 'sweets'
        },
        {
            id: nextId++,
            name: 'Pootharekulu',
            price: 150,
            description: 'Delicate paper sweets made with rice flour and jaggery',
            category: 'sweets'
        },
        {
            id: nextId++,
            name: 'Ariselu',
            price: 80,
            description: 'Traditional sweet made with rice flour and jaggery',
            category: 'sweets'
        },
        {
            id: nextId++,
            name: 'Murukulu',
            price: 50,
            description: 'Crispy savory snack made with rice flour and spices',
            category: 'pindi-vantalu'
        },
        {
            id: nextId++,
            name: 'Chekkalu',
            price: 45,
            description: 'Flat crispy discs made with rice flour and sesame seeds',
            category: 'pindi-vantalu'
        },
        {
            id: nextId++,
            name: 'Jantikalu',
            price: 55,
            description: 'Spicy twisted snack perfect for tea time',
            category: 'pindi-vantalu'
        },
        {
            id: nextId++,
            name: 'Sakinalu',
            price: 60,
            description: 'Traditional snack made with rice flour and sesame, shaped into rings',
            category: 'pindi-vantalu'
        }
    ];
    saveMenuItems();
}

// Save menu items to localStorage
function saveMenuItems() {
    localStorage.setItem('pindiVantaluItems', JSON.stringify(menuItems));
}

// Load admin credentials from localStorage
function loadCredentials() {
    const storedCredentials = localStorage.getItem(CREDENTIALS_KEY);
    if (storedCredentials) {
        adminCredentials = JSON.parse(storedCredentials);
    }
}

// Save admin credentials to localStorage
function saveCredentials() {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(adminCredentials));
}

// Cart Functions
function loadCart() {
    const storedCart = localStorage.getItem(CART_KEY);
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    updateCartUI();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    saveCart();
    showToast(`${item.name} added to cart!`, 'success');
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    if (itemIndex !== -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        saveCart();
        showToast(`${itemName} removed from cart`, 'success');
    }
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        saveCart();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        showToast('Cart cleared', 'success');
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartUI() {
    // Update cart count
    const itemCount = getCartItemCount();
    cartCount.textContent = itemCount;
    cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    
    // Update cart sidebar
    renderCartItems();
    
    // Update cart total
    cartTotal.textContent = `₹${getCartTotal().toFixed(2)}`;
    
    // Show/hide empty state
    if (cart.length === 0) {
        cartItems.classList.add('hidden');
        cartEmpty.classList.remove('hidden');
    } else {
        cartItems.classList.remove('hidden');
        cartEmpty.classList.add('hidden');
    }
}

// Authentication Functions
function checkAuthentication() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
        const sessionData = JSON.parse(session);
        const currentTime = Date.now();
        
        if (sessionData.expiry > currentTime) {
            isAuthenticated = true;
            updateAdminButton();
        } else {
            // Session expired
            localStorage.removeItem(SESSION_KEY);
            isAuthenticated = false;
            updateAdminButton();
        }
    } else {
        isAuthenticated = false;
        updateAdminButton();
    }
}

function createSession() {
    const sessionData = {
        loginTime: Date.now(),
        expiry: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    isAuthenticated = true;
    updateAdminButton();
}

function destroySession() {
    localStorage.removeItem(SESSION_KEY);
    isAuthenticated = false;
    updateAdminButton();
}

function updateAdminButton() {
    if (isAuthenticated) {
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin (Logged In)';
        adminBtn.style.background = 'rgba(40, 167, 69, 0.8)';
        adminBtn.style.borderColor = '#28a745';
    } else {
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin';
        adminBtn.style.background = 'rgba(255,255,255,0.2)';
        adminBtn.style.borderColor = 'white';
    }
}

function validateCredentials(username, password) {
    return username === adminCredentials.username && 
           password === adminCredentials.password;
}

function openLoginModal() {
    loginModal.classList.remove('hidden');
    usernameInput.focus();
}

function closeLoginModal() {
    loginModal.classList.add('hidden');
    loginForm.reset();
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        showToast('Please enter both username and password', 'error');
        return;
    }
    
    if (validateCredentials(username, password)) {
        createSession();
        closeLoginModal();
        openAdminPanel();
        showToast('Login successful! Welcome to admin panel.', 'success');
    } else {
        showToast('Invalid username or password', 'error');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        destroySession();
        closeAdminPanel();
        showToast('Logged out successfully', 'success');
    }
}

// Handle credential update
function handleUpdateCredentials(e) {
    e.preventDefault();
    
    const currentPassword = currentPasswordInput.value.trim();
    const newUsername = newUsernameInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate current password
    if (currentPassword !== adminCredentials.password) {
        showToast('Current password is incorrect', 'error');
        return;
    }
    
    // Check if at least one field is being updated
    if (!newUsername && !newPassword) {
        showToast('Please enter a new username or password', 'error');
        return;
    }
    
    // Validate new password if provided
    if (newPassword) {
        if (newPassword.length < 6) {
            showToast('New password must be at least 6 characters long', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('New password and confirmation do not match', 'error');
            return;
        }
    }
    
    // Update credentials
    let updated = false;
    const oldUsername = adminCredentials.username;
    
    if (newUsername && newUsername !== adminCredentials.username) {
        adminCredentials.username = newUsername;
        updated = true;
    }
    
    if (newPassword) {
        adminCredentials.password = newPassword;
        updated = true;
    }
    
    if (updated) {
        saveCredentials();
        
        // If username changed, update session and show message
        if (newUsername && newUsername !== oldUsername) {
            showToast(`Username updated to: ${newUsername}`, 'success');
        }
        
        if (newPassword) {
            showToast('Password updated successfully', 'success');
        }
        
        // Reset form
        updateCredentialsForm.reset();
        
        // If password changed, logout user for security
        if (newPassword) {
            showToast('For security, please login again with your new password', 'warning');
            setTimeout(() => {
                destroySession();
                closeAdminPanel();
                openLoginModal();
            }, 2000);
        }
    } else {
        showToast('No changes made', 'warning');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Cart controls - with error checking
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cart button clicked');
            openCart();
        });
    } else {
        console.error('Cart button not found');
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Admin panel controls
    adminBtn.addEventListener('click', handleAdminButtonClick);
    closeAdminBtn.addEventListener('click', closeAdminPanel);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Login modal controls
    closeLoginModalBtn.addEventListener('click', closeLoginModal);
    cancelLoginBtn.addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    
    // Credentials form
    updateCredentialsForm.addEventListener('submit', handleUpdateCredentials);
    
    // Forms
    addItemForm.addEventListener('submit', handleAddItem);
    editItemForm.addEventListener('submit', handleEditItem);
    
    // Modal controls
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    
    // Close modals on outside click
    adminPanel.addEventListener('click', function(e) {
        if (e.target === adminPanel) {
            closeAdminPanel();
        }
    });
    
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });
    
    // Close cart on outside click
    document.addEventListener('click', function(e) {
        if (e.target === cartSidebar) {
            closeCart();
        }
    });
    
    // Navigation smooth scroll
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Handle admin button click based on authentication status
function handleAdminButtonClick() {
    if (isAuthenticated) {
        openAdminPanel();
    } else {
        openLoginModal();
    }
}

// Render menu items on the main page
function renderMenuItems() {
    menuGrid.innerHTML = '';
    
    if (menuItems.length === 0) {
        menuGrid.innerHTML = '<div class="text-center"><p>No items available. Please add items through the admin panel.</p></div>';
        return;
    }
    
    menuItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuGrid.appendChild(menuItemElement);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    
    const categoryIcon = getCategoryIcon(item.category);
    
    div.innerHTML = `
        <div class="menu-item-image">
            <i class="${categoryIcon}"></i>
        </div>
        <div class="menu-item-content">
            <div class="menu-item-header">
                <h3 class="menu-item-name">${item.name}</h3>
                <span class="menu-item-price">₹${item.price.toFixed(2)}</span>
            </div>
            <span class="menu-item-category">${item.category}</span>
            <p class="menu-item-description">${item.description || 'Delicious traditional South Indian preparation'}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    
    return div;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        pickles: 'fas fa-pepper-hot',
        sweets: 'fas fa-candy-cane',
        'pindi-vantalu': 'fas fa-cookie-bite'
    };
    return icons[category] || 'fas fa-utensils';
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #dc3545; margin-left: 10px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItemElement);
    });
}

// Cart UI Functions - Make globally accessible
window.openCart = function() {
    console.log('Opening cart...');
    
    if (cartSidebar) {
        cartSidebar.classList.add('active');
        cartSidebar.style.visibility = 'visible';
        console.log('Cart sidebar opened');
    } else {
        console.error('Cart sidebar not found');
    }
};

window.closeCart = function() {
    console.log('Closing cart...');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
        console.log('Cart sidebar closed');
    }
};

function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const total = getCartTotal();
    const itemCount = getCartItemCount();
    
    // Build order details for WhatsApp message
    let orderMessage = "🍽️ *SRIDEVI PINDI VANTALU Order* 🍽️\n\n";
    orderMessage += "*Order Details:*\n";
    
    cart.forEach((item, index) => {
        orderMessage += `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    orderMessage += `\n*Total Items:* ${itemCount}`;
    orderMessage += `\n*Total Amount:* ₹${total.toFixed(2)}`;
    orderMessage += "\n\n*Customer Details Needed:*\n";
    orderMessage += "📞 Phone Number:\n";
    orderMessage += "🏠 Delivery Address:\n";
    orderMessage += "👤 Name:\n";
    orderMessage += "📝 Special Instructions (if any):\n\n";
    orderMessage += "Please confirm your order by providing the above details.";
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappNumber = "9866406807";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Clear cart after successful checkout
    cart = [];
    saveCart();
    closeCart();
    showToast('Redirecting to WhatsApp to place your order...', 'success');
}

// Render admin items list
function renderAdminItemsList() {
    adminItemsList.innerHTML = '';
    
    if (menuItems.length === 0) {
        adminItemsList.innerHTML = '<p class="text-center">No items available.</p>';
        return;
    }
    
    menuItems.forEach(item => {
        const adminItemElement = createAdminItemElement(item);
        adminItemsList.appendChild(adminItemElement);
    });
}

// Create admin item element
function createAdminItemElement(item) {
    const div = document.createElement('div');
    div.className = 'admin-item';
    
    div.innerHTML = `
        <div class="admin-item-info">
            <div class="admin-item-name">${item.name}</div>
            <div class="admin-item-details">
                ₹${item.price.toFixed(2)} | ${item.category}
                ${item.description ? ` | ${item.description.substring(0, 50)}...` : ''}
            </div>
        </div>
        <div class="admin-item-actions">
            <button class="btn btn-warning" onclick="editItem(${item.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger" onclick="deleteItem(${item.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return div;
}

// Open admin panel
function openAdminPanel() {
    adminPanel.classList.remove('hidden');
    renderAdminItemsList();
}

// Close admin panel
function closeAdminPanel() {
    adminPanel.classList.add('hidden');
}

// Handle add item form submission
function handleAddItem(e) {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const description = document.getElementById('itemDescription').value.trim();
    const category = document.getElementById('itemCategory').value;
    
    if (!name || isNaN(price) || price <= 0) {
        showToast('Please fill in all required fields with valid values', 'error');
        return;
    }
    
    const newItem = {
        id: nextId++,
        name,
        price,
        description,
        category
    };
    
    menuItems.push(newItem);
    saveMenuItems();
    renderMenuItems();
    renderAdminItemsList();
    
    // Reset form
    addItemForm.reset();
    
    showToast('Item added successfully!', 'success');
}

// Edit item
function editItem(id) {
    const item = menuItems.find(item => item.id === id);
    if (!item) return;
    
    // Populate edit form
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemDescription').value = item.description || '';
    document.getElementById('editItemCategory').value = item.category;
    
    // Show edit modal
    editModal.classList.remove('hidden');
}

// Handle edit item form submission
function handleEditItem(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editItemId').value);
    const name = document.getElementById('editItemName').value.trim();
    const price = parseFloat(document.getElementById('editItemPrice').value);
    const description = document.getElementById('editItemDescription').value.trim();
    const category = document.getElementById('editItemCategory').value;
    
    if (!name || isNaN(price) || price <= 0) {
        showToast('Please fill in all required fields with valid values', 'error');
        return;
    }
    
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    // Update item
    menuItems[itemIndex] = {
        id,
        name,
        price,
        description,
        category
    };
    
    saveMenuItems();
    renderMenuItems();
    renderAdminItemsList();
    closeEditModal();
    
    showToast('Item updated successfully!', 'success');
}

// Delete item
function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    const itemName = menuItems[itemIndex].name;
    menuItems.splice(itemIndex, 1);
    
    saveMenuItems();
    renderMenuItems();
    renderAdminItemsList();
    
    showToast(`${itemName} deleted successfully!`, 'success');
}

// Close edit modal
function closeEditModal() {
    editModal.classList.add('hidden');
    editItemForm.reset();
}

// Update active navigation link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Utility function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

// Search functionality (bonus feature)
function searchItems(query) {
    if (!query) {
        renderMenuItems();
        return;
    }
    
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    menuGrid.innerHTML = '';
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<div class="text-center"><p>No items found matching your search.</p></div>';
        return;
    }
    
    filteredItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuGrid.appendChild(menuItemElement);
    });
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') {
        renderMenuItems();
        return;
    }
    
    const filteredItems = menuItems.filter(item => item.category === category);
    
    menuGrid.innerHTML = '';
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<div class="text-center"><p>No items found in this category.</p></div>';
        return;
    }
    
    filteredItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuGrid.appendChild(menuItemElement);
    });
}

// Export data (bonus feature)
function exportData() {
    const dataStr = JSON.stringify(menuItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'pindi-vantalu-items.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Data exported successfully!', 'success');
}

// Import data (bonus feature)
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedItems = JSON.parse(e.target.result);
            
            if (Array.isArray(importedItems)) {
                menuItems = importedItems;
                nextId = Math.max(...menuItems.map(item => item.id), 0) + 1;
                saveMenuItems();
                renderMenuItems();
                renderAdminItemsList();
                showToast('Data imported successfully!', 'success');
            } else {
                showToast('Invalid data format!', 'error');
            }
        } catch (error) {
            showToast('Error importing data!', 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + A to open admin panel
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        openAdminPanel();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAdminPanel();
        closeEditModal();
    }
});

// Initialize tooltips and other interactive elements
function initializeInteractiveElements() {
    // Add hover effects to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', function() {
    initializeInteractiveElements();
});
