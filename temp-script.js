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
