// Firebase Database Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCTKX8Y9Q8Z7W6L5M4N3O2P1Q9R8S7T6U5",
    authDomain: "sridevi-pindi-vantalu-8c1c1.firebaseapp.com",
    databaseURL: "https://sridevi-pindi-vantalu-8c1c1-default-rtdb.firebaseio.com",
    projectId: "sridevi-pindi-vantalu-8c1c1",
    storageBucket: "sridevi-pindi-vantalu-8c1c1.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Database references
const ordersRef = database.ref('orders');
const visitorsRef = database.ref('visitors');
const analyticsRef = database.ref('analytics');
const inventoryRef = database.ref('inventory');

// Live monitoring functions
class LiveMonitoring {
    // Track visitor
    static trackVisitor() {
        const visitorData = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userAgent: navigator.userAgent,
            page: window.location.pathname,
            referrer: document.referrer,
            sessionId: this.getSessionId()
        };
        
        visitorsRef.push(visitorData);
        this.updateAnalytics('visits');
    }

    // Track page view
    static trackPageView() {
        const pageViewData = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            page: window.location.pathname,
            title: document.title
        };
        
        analyticsRef.child('pageViews').push(pageViewData);
        this.updateAnalytics('pageViews');
    }

    // Track order
    static trackOrder(orderData) {
        const order = {
            ...orderData,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            status: 'pending',
            orderId: this.generateOrderId()
        };
        
        ordersRef.push(order);
        this.updateAnalytics('orders');
        this.updateInventory(order.items);
        
        return order.orderId;
    }

    // Track cart activity
    static trackCartActivity(action, item) {
        const cartActivity = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            action: action, // 'add', 'remove', 'update'
            item: item,
            sessionId: this.getSessionId()
        };
        
        analyticsRef.child('cartActivity').push(cartActivity);
    }

    // Update analytics counters
    static updateAnalytics(type) {
        analyticsRef.child('counters').child(type).transaction((current) => {
            return (current || 0) + 1;
        });
    }

    // Update inventory
    static updateInventory(items) {
        items.forEach(item => {
            inventoryRef.child(item.id).transaction((current) => {
                if (!current) {
                    return {
                        name: item.name,
                        category: item.category,
                        price: item.price,
                        stock: 100, // Default stock
                        sold: (current?.sold || 0) + item.quantity
                    };
                }
                return {
                    ...current,
                    sold: (current.sold || 0) + item.quantity
                };
            });
        });
    }

    // Get session ID
    static getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    // Generate order ID
    static generateOrderId() {
        return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    // Listen for real-time updates
    static listenForUpdates() {
        // Listen for new orders
        ordersRef.on('child_added', (snapshot) => {
            const order = snapshot.val();
            this.showNotification('New Order Received!', `Order #${order.orderId} - ₹${order.total.toFixed(2)}`);
        });

        // Listen for visitor updates
        visitorsRef.limitToLast(1).on('child_added', (snapshot) => {
            console.log('New visitor tracked');
        });
    }

    // Show browser notification
    static showNotification(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/images/logo.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: body,
                        icon: '/images/logo.png'
                    });
                }
            });
        }
    }

    // Get live stats
    static async getLiveStats() {
        const snapshot = await analyticsRef.child('counters').once('value');
        return snapshot.val() || {};
    }
}

// Initialize monitoring on page load
document.addEventListener('DOMContentLoaded', function() {
    // Track visitor and page view
    LiveMonitoring.trackVisitor();
    LiveMonitoring.trackPageView();
    
    // Listen for real-time updates
    LiveMonitoring.listenForUpdates();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// Export for use in other files
window.LiveMonitoring = LiveMonitoring;
