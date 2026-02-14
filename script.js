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

// Admin access is now restricted - use direct URL for admin dashboard
// Main website no longer has admin shortcuts for security

// Direct checkout function - bypasses event listeners
function handleCheckoutDirect() {
    console.log('Direct checkout function called');
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Show customer details form instead of direct checkout
    showCustomerDetailsForm();
}

// Show customer details form - Make globally accessible
window.showCustomerDetailsForm = function() {
    console.log('showCustomerDetailsForm called');
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const cartFooter = document.querySelector('.cart-footer');
    const customerForm = document.getElementById('customerDetailsForm');
    
    console.log('Elements found:', { cartFooter: !!cartFooter, customerForm: !!customerForm });
    
    if (cartFooter && customerForm) {
        cartFooter.classList.add('hidden');
        customerForm.classList.remove('hidden');
        
        // Focus on first input field
        setTimeout(() => {
            const nameInput = document.getElementById('customerName');
            if (nameInput) {
                nameInput.focus();
                console.log('Focused on name input');
            }
        }, 300);
        
        console.log('Customer details form shown');
    } else {
        console.error('Cart footer or customer form not found');
        alert('Error: Could not open customer details form');
    }
};

// Hide customer details form and show cart footer - Make globally accessible
window.hideCustomerDetailsForm = function() {
    console.log('hideCustomerDetailsForm called');
    
    const cartFooter = document.querySelector('.cart-footer');
    const customerForm = document.getElementById('customerDetailsForm');
    
    console.log('Elements found:', { cartFooter: !!cartFooter, customerForm: !!customerForm });
    
    if (cartFooter && customerForm) {
        cartFooter.classList.remove('hidden');
        customerForm.classList.add('hidden');
        console.log('Customer details form hidden');
    } else {
        console.error('Cart footer or customer form not found');
    }
};

// Cancel customer form function - Make globally accessible
window.cancelCustomerForm = function() {
    console.log('cancelCustomerForm called');
    
    if (confirm('Are you sure you want to cancel this order?')) {
        hideCustomerDetailsForm();
        const customerFormElement = document.getElementById('customerForm');
        if (customerFormElement) {
            customerFormElement.reset();
            console.log('Customer form reset');
        }
    }
};

// Submit customer form function - Make globally accessible
window.submitCustomerForm = function() {
    console.log('submitCustomerForm called');
    
    // Get customer details
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const customerInstructions = document.getElementById('customerInstructions').value.trim();
    
    console.log('Customer details:', { customerName, customerPhone, customerAddress, customerInstructions });
    
    // Validate required fields
    if (!customerName || !customerPhone || !customerAddress) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate phone number (10 digits)
    if (!/^[0-9]{10}$/.test(customerPhone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    // Proceed with WhatsApp checkout with customer details
    proceedWithWhatsAppCheckout(customerName, customerPhone, customerAddress, customerInstructions);
};

// Handle customer form submission
function handleCustomerForm(e) {
    e.preventDefault();
    submitCustomerForm();
}

// Proceed with WhatsApp checkout including customer details - Make globally accessible
window.proceedWithWhatsAppCheckout = function(customerName, customerPhone, customerAddress, customerInstructions) {
    const total = getCartTotal();
    const itemCount = getCartItemCount();
    
    // Build order details for WhatsApp message
    let orderMessage = "🍽️ *SRIDEVI PINDI VANTALU Order* 🍽️\n\n";
    
    // Add customer details
    orderMessage += "*👤 Customer Details:*\n";
    orderMessage += `📞 Name: ${customerName}\n`;
    orderMessage += `📱 Phone: ${customerPhone}\n`;
    orderMessage += `🏠 Address: ${customerAddress}\n`;
    if (customerInstructions) {
        orderMessage += `📝 Instructions: ${customerInstructions}\n`;
    }
    orderMessage += "\n";
    
    // Add order details
    orderMessage += "*📋 Order Details:*\n";
    
    cart.forEach((item, index) => {
        orderMessage += `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    orderMessage += `\n*Total Items:* ${itemCount}`;
    orderMessage += `\n*Total Amount:* ₹${total.toFixed(2)}`;
    orderMessage += "\n\n*📞 Please confirm this order and provide delivery details.*";
    
    // Generate order ID
    const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Add order ID to WhatsApp message
    orderMessage = `📋 *Order ID: ${orderId}*\n\n` + orderMessage;
    
    console.log('Order message with customer details:', orderMessage);
    
    // Track order in Firebase database (with error handling)
    let finalOrderId = orderId;
    
    try {
        if (typeof LiveMonitoring !== 'undefined' && LiveMonitoring.trackOrder) {
            const orderData = {
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity
                })),
                total: total,
                itemCount: itemCount,
                status: 'pending',
                customerDetails: {
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress,
                    instructions: customerInstructions
                }
            };
            finalOrderId = LiveMonitoring.trackOrder(orderData);
        }
    } catch (error) {
        console.log('Database tracking failed, using local order ID:', error);
    }
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappNumber = "9866406807";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    console.log('WhatsApp URL:', whatsappURL);
    
    // Open WhatsApp in new tab with multiple fallbacks
    try {
        // Method 1: Direct window.open
        const newWindow = window.open(whatsappURL, '_blank');
        
        if (newWindow) {
            console.log('WhatsApp opened successfully');
            // Clear cart and reset form after successful checkout
            cart = [];
            saveCart();
            closeCart();
            hideCustomerDetailsForm();
            document.getElementById('customerForm').reset();
            alert(`Order #${finalOrderId} placed! WhatsApp opened in new tab.`);
        } else {
            // Method 2: Popup blocked, try location change
            console.log('Popup blocked, trying location change');
            window.location.href = whatsappURL;
        }
    } catch (error) {
        console.error('Failed to open WhatsApp:', error);
        
        // Method 3: Copy to clipboard
        try {
            navigator.clipboard.writeText(orderMessage).then(() => {
                alert(`Order #${finalOrderId} prepared! Message copied to clipboard. Please open WhatsApp manually and paste.`);
            }).catch(() => {
                // Method 4: Show message in alert
                alert(`Order #${finalOrderId} prepared! Please open WhatsApp and send this message:\n\n${orderMessage}`);
            });
        } catch (clipboardError) {
            alert(`Order #${finalOrderId} prepared! Please open WhatsApp and send this message:\n\n${orderMessage}`);
        }
    }
}

// Original handleCheckout function (kept for compatibility)
function handleCheckout() {
    console.log('handleCheckout called - this should not be used anymore');
    // This function is deprecated, use showCustomerDetailsForm() instead
}

// Function to show admin panel
function showAdminPanel() {
    // Create admin panel if it doesn't exist
    if (!document.getElementById('adminPanel')) {
        createAdminPanel();
    }
    
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.classList.remove('hidden');
        
        // Check if already authenticated
        if (isAuthenticated) {
            // Show admin content directly
            loadAdminItems();
        } else {
            // Show login modal
            showLoginModal();
        }
    }
}

// Function to create admin panel dynamically
function createAdminPanel() {
    const adminHTML = `
        <div id="adminPanel" class="admin-panel hidden">
            <div class="admin-container">
                <div class="admin-header">
                    <h2>Admin Panel</h2>
                    <div class="admin-header-actions">
                        <button id="logoutBtn" class="btn btn-secondary">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                        <button id="closeAdminBtn" class="close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="admin-content">
                    <!-- Add Item Form -->
                    <div class="admin-section">
                        <h3>Add New Item</h3>
                        <form id="addItemForm" class="item-form">
                            <div class="form-group">
                                <label for="itemName">Item Name</label>
                                <input type="text" id="itemName" required>
                            </div>
                            <div class="form-group">
                                <label for="itemPrice">Price (₹)</label>
                                <input type="number" id="itemPrice" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label for="itemDescription">Description</label>
                                <textarea id="itemDescription" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="itemCategory">Category</label>
                                <select id="itemCategory">
                                    <option value="pickles">Pickles</option>
                                    <option value="sweets">Sweets</option>
                                    <option value="pindi-vantalu">Pindi Vantalu</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Add Item</button>
                        </form>
                    </div>

                    <!-- Edit/Delete Items -->
                    <div class="admin-section">
                        <h3>Manage Items</h3>
                        <div class="items-list" id="adminItemsList">
                            <!-- Items will be dynamically added here -->
                        </div>
                    </div>

                    <!-- Update Credentials -->
                    <div class="admin-section">
                        <h3>Update Admin Credentials</h3>
                        <form id="updateCredentialsForm" class="credentials-form">
                            <div class="form-group">
                                <label for="currentPassword">Current Password</label>
                                <input type="password" id="currentPassword" required placeholder="Enter current password">
                            </div>
                            <div class="form-group">
                                <label for="newUsername">New Username</label>
                                <input type="text" id="newUsername" placeholder="Enter new username (optional)">
                            </div>
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input type="password" id="newPassword" placeholder="Enter new password (optional)">
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password</label>
                                <input type="password" id="confirmPassword" placeholder="Confirm new password">
                            </div>
                            <button type="submit" class="btn btn-warning">
                                <i class="fas fa-key"></i> Update Credentials
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Login Modal -->
        <div id="loginModal" class="modal hidden">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Admin Login</h3>
                    <button class="close-modal" id="closeLoginModalBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" required placeholder="Enter username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required placeholder="Enter password">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Login</button>
                        <button type="button" class="btn btn-secondary" id="cancelLoginBtn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Insert admin panel before cart sidebar
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.insertAdjacentHTML('beforebegin', adminHTML);
    } else {
        document.body.insertAdjacentHTML('beforeend', adminHTML);
    }
    
    // Re-initialize admin event listeners
    initializeAdminEventListeners();
}

// Initialize admin event listeners
function initializeAdminEventListeners() {
    // Admin panel buttons
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminPanel);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Login modal buttons
    const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
    const cancelLoginBtn = document.getElementById('cancelLoginBtn');
    
    if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', hideLoginModal);
    if (cancelLoginBtn) cancelLoginBtn.addEventListener('click', hideLoginModal);
    
    // Forms
    const loginForm = document.getElementById('loginForm');
    const addItemForm = document.getElementById('addItemForm');
    const updateCredentialsForm = document.getElementById('updateCredentialsForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (addItemForm) addItemForm.addEventListener('submit', handleAddItem);
    if (updateCredentialsForm) updateCredentialsForm.addEventListener('submit', handleUpdateCredentials);
    
    // Load admin items if authenticated
    if (isAuthenticated) {
        loadAdminItems();
    }
}

// Show login modal
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('hidden');
    }
}

// Hide login modal
function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('hidden');
    }
}

// Close admin panel
function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.classList.add('hidden');
    }
}

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
    
    // Track cart activity
    LiveMonitoring.trackCartActivity('add', {
        id: item.id,
        name: item.name,
        price: item.price
    });
    
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
    const adminBtn = document.getElementById('adminBtn');
    if (!adminBtn) return; // Exit if admin button doesn't exist
    
    if (isAuthenticated) {
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin Panel';
        adminBtn.style.display = 'inline-block';
    } else {
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin Login';
        adminBtn.style.display = 'inline-block';
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
        hideLoginModal();
        // Show admin content after successful login
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.remove('hidden');
        }
        loadAdminItems();
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
        // Remove the old event listener that was interfering
        checkoutBtn.removeEventListener('click', handleCheckout);
        console.log('Old checkout event listener removed');
    } else {
        console.error('Checkout button not found');
    }
    
    // Customer form event listeners
    const backToCartBtn = document.getElementById('backToCartBtn');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const customerForm = document.getElementById('customerForm');
    
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', hideCustomerDetailsForm);
    }
    
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel this order?')) {
                hideCustomerDetailsForm();
                document.getElementById('customerForm').reset();
            }
        });
    }
    
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerForm);
    }
    
    // Admin panel controls - only if they exist
    if (typeof adminBtn !== 'undefined' && adminBtn) {
        adminBtn.addEventListener('click', handleAdminButtonClick);
    }
    if (typeof closeAdminBtn !== 'undefined' && closeAdminBtn) {
        closeAdminBtn.addEventListener('click', closeAdminPanel);
    }
    if (typeof logoutBtn !== 'undefined' && logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Login modal controls - only if they exist
    if (typeof closeLoginModalBtn !== 'undefined' && closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', closeLoginModal);
    }
    if (typeof cancelLoginBtn !== 'undefined' && cancelLoginBtn) {
        cancelLoginBtn.addEventListener('click', closeLoginModal);
    }
    if (typeof loginForm !== 'undefined' && loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Credentials form - only if it exists
    if (typeof updateCredentialsForm !== 'undefined' && updateCredentialsForm) {
        updateCredentialsForm.addEventListener('submit', handleUpdateCredentials);
    }
    
    // Forms - only if they exist
    if (typeof addItemForm !== 'undefined' && addItemForm) {
        addItemForm.addEventListener('submit', handleAddItem);
    }
    if (typeof editItemForm !== 'undefined' && editItemForm) {
        editItemForm.addEventListener('submit', handleEditItem);
    }
    
    // Modal controls - only if they exist
    if (typeof closeModalBtn !== 'undefined' && closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEditModal);
    }
    if (typeof cancelEditBtn !== 'undefined' && cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    }
    
    // Close modals on outside click - only if elements exist
    if (typeof adminPanel !== 'undefined' && adminPanel) {
        adminPanel.addEventListener('click', function(e) {
            if (e.target === adminPanel) {
                closeAdminPanel();
            }
        });
    }
    
    if (typeof editModal !== 'undefined' && editModal) {
        editModal.addEventListener('click', function(e) {
            if (e.target === editModal) {
                closeEditModal();
            }
        });
    }
    
    if (typeof loginModal !== 'undefined' && loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }
    
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

// Save menu items to localStorage
function saveMenuItems() {
    localStorage.setItem('pindiVantaluMenuItems', JSON.stringify(menuItems));
}

// Load menu items from localStorage
function loadMenuItems() {
    const savedItems = localStorage.getItem('pindiVantaluMenuItems');
    if (savedItems) {
        try {
            menuItems = JSON.parse(savedItems);
            // Update nextId to avoid conflicts
            if (menuItems.length > 0) {
                nextId = Math.max(...menuItems.map(item => item.id)) + 1;
            }
        } catch (error) {
            console.error('Error loading menu items:', error);
            menuItems = getDefaultMenuItems();
        }
    } else {
        menuItems = getDefaultMenuItems();
    }
}

// Get default menu items if none exist
function getDefaultMenuItems() {
    return [
        {
            id: 1,
            name: "Mango Pickle",
            price: 150,
            description: "Traditional homemade mango pickle with authentic spices",
            category: "pickles"
        },
        {
            id: 2,
            name: "Lemon Pickle",
            price: 120,
            description: "Tangy lemon pickle with mustard seeds",
            category: "pickles"
        },
        {
            id: 3,
            name: "Gulab Jamun",
            price: 80,
            description: "Soft and sweet milk dumplings in sugar syrup",
            category: "sweets"
        },
        {
            id: 4,
            name: "Jalebi",
            price: 60,
            description: "Crispy sweet spirals soaked in sugar syrup",
            category: "sweets"
        },
        {
            id: 5,
            name: "Murukulu",
            price: 100,
            description: "Crispy rice flour spirals with sesame seeds",
            category: "pindi-vantalu"
        },
        {
            id: 6,
            name: "Chekkalu",
            price: 90,
            description: "Savory rice crackers with spices",
            category: "pindi-vantalu"
        }
    ];
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
    
    const orderItems = [];
    
    cart.forEach((item, index) => {
        orderMessage += `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
        
        orderItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        });
    });
    
    orderMessage += `\n*Total Items:* ${itemCount}`;
    orderMessage += `\n*Total Amount:* ₹${total.toFixed(2)}`;
    orderMessage += "\n\n*Customer Details Needed:*\n";
    orderMessage += "📞 Phone Number:\n";
    orderMessage += "🏠 Delivery Address:\n";
    orderMessage += "👤 Name:\n";
    orderMessage += "📝 Special Instructions (if any):\n\n";
    orderMessage += "Please confirm your order by providing the above details.";
    
    // Track order in Firebase database (with error handling)
    let orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    try {
        if (typeof LiveMonitoring !== 'undefined' && LiveMonitoring.trackOrder) {
            orderId = LiveMonitoring.trackOrder(orderData);
        }
    } catch (error) {
        console.log('Database tracking failed, using local order ID:', error);
    }
    
    // Add order ID to WhatsApp message
    orderMessage = `📋 *Order ID: ${orderId}*\n\n` + orderMessage;
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappNumber = "9866406807";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab with error handling
    try {
        window.open(whatsappURL, '_blank');
        console.log('WhatsApp URL opened:', whatsappURL);
    } catch (error) {
        console.error('Failed to open WhatsApp:', error);
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(orderMessage).then(() => {
            alert('Order details copied to clipboard! Please open WhatsApp manually and paste the message.');
        }).catch(() => {
            alert('Please manually open WhatsApp and send this message:\n\n' + orderMessage);
        });
    }
    
    // Clear cart after successful checkout
    cart = [];
    saveCart();
    closeCart();
    showToast(`Order #${orderId} placed! Opening WhatsApp...`, 'success');
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

// Keyboard shortcuts - admin access removed for security
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAdminPanel();
        closeEditModal();
        hideLoginModal();
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
    console.log('DOM Content Loaded - Starting initialization');
    
    // Load menu items first
    loadMenuItems();
    
    // Initialize UI
    renderMenuItems();
    
    // Initialize other elements
    initializeInteractiveElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
    
    console.log('Initialization complete');
});

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        console.log('Mobile menu elements found');
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            
            // Toggle active classes
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            console.log('Menu active state:', navLinks.classList.contains('active'));
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                console.log('Mobile menu closed (outside click)');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinksItems = document.querySelectorAll('.nav-link');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                console.log('Mobile menu closed (link click)');
            });
        });
    } else {
        console.error('Mobile menu elements not found:', {
            mobileMenuBtn: !!mobileMenuBtn,
            navLinks: !!navLinks
        });
    }
}

// Listen for storage changes from other tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'pindiVantaluMenuItems') {
        // Reload menu items when changed in another tab
        loadMenuItems();
        renderMenuItems();
        console.log('Menu items synced from another tab');
    }
});

// Periodic sync check (every 5 seconds)
setInterval(function() {
    const currentItems = localStorage.getItem('pindiVantaluMenuItems');
    if (currentItems !== JSON.stringify(menuItems)) {
        loadMenuItems();
        renderMenuItems();
        console.log('Menu items auto-synced');
    }
}, 5000);
