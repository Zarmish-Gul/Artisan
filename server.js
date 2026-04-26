const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Assuming your HTML/CSS/JS files are in a folder named 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- IN-MEMORY DATABASES ---
// This acts as your temporary database for your university project
let users = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' }
];

let products = [
    { 
        id: 101, 
        title: 'Hand-Knitted Sweater', 
        category: 'Woven', 
        price: 56.12, 
        stock: 10, 
        image: 'images/sw.jpg', 
        description: 'Warm, hand-knitted wool sweater made with heritage techniques.' 
    },
    { 
        id: 102, 
        title: 'Hand Painted Vase', 
        category: 'Pottery', 
        price: 18.00, 
        stock: 5, 
        image: 'images/hpv.jpg', 
        description: 'Delicate ceramic vase with hand-painted floral motifs.' 
    },
    { 
        id: 103, 
        title: 'Stone Locket', 
        category: 'Jewelry', 
        price: 24.50, 
        stock: 15, 
        image: 'images/ss.jpg', 
        description: 'Natural stone encased in a handcrafted silver locket.' 
    },
    { 
        id: 104, 
        title: 'Knitted Cord Coasters', 
        category: 'Woven', 
        price: 12.00, 
        stock: 50, 
        image: 'images/kcc.jpg', 
        description: 'Set of 4 durable, hand-knitted coasters for modern homes.' 
    },
    { 
        id: 105, 
        title: 'Wall Decor Piece', 
        category: 'Decor', 
        price: 35.00, 
        stock: 8, 
        image: 'images/walld.jpg', 
        description: 'Abstract wall art made from reclaimed wood and artisan fibers.' 
    }
];

// For your "Journal/Blog" or Support inquiries
let tickets = [
    { id: 1, name: 'Arid Student', email: 'student@uaar.edu.pk', category: 'General', message: 'Do you offer student discounts?', status: 'Pending' }
];

// --- AUTHENTICATION API ---
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) return res.status(400).json({ message: 'User already exists.' });
    
    const newUser = { id: users.length + 1, username, password, role: 'user' };
    users.push(newUser);
    res.status(201).json({ message: 'Account created!', user: { username: newUser.username, role: newUser.role } });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return res.status(401).json({ message: 'Invalid username or password.' });
    res.status(200).json({ message: 'Success', user: { username: user.username, role: user.role } });
});

// --- PRODUCTS API ---
// This allows your Shop page to fetch products dynamically
app.get('/api/products', (req, res) => res.status(200).json(products));

app.post('/api/products', (req, res) => {
    const newProduct = { 
        id: products.length ? products[products.length - 1].id + 1 : 101, 
        ...req.body 
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.status(200).json({ message: 'Product removed' });
});

// --- TICKETS/INQUIRIES API ---
app.get('/api/tickets', (req, res) => res.status(200).json(tickets));

app.post('/api/tickets', (req, res) => {
    const newTicket = { 
        id: tickets.length ? tickets[tickets.length - 1].id + 1 : 1, 
        ...req.body, 
        status: 'Pending' 
    };
    tickets.push(newTicket);
    res.status(201).json(newTicket);
});
// --- ORDERS DATABASE (In-Memory) ---
let orders = [];

// --- ORDERS API ---
app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    
    // Validate that we actually got data
    if (!newOrder || !newOrder.items || newOrder.items.length === 0) {
        return res.status(400).json({ message: 'Order is empty or invalid.' });
    }

    // Save the order to our "database"
    orders.push(newOrder);
    
    console.log("✅ New Order Received:", newOrder.orderId);
    console.log("Customer:", newOrder.customerName);

    // Send a success response back to the frontend
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
});

// Optional: Add a route for the admin to see all orders
app.get('/api/orders', (req, res) => {
    res.status(200).json(orders);
});
// Vercel / Local Server Start
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🎨 Artisan Portal running on http://localhost:${PORT}`));
}

module.exports = app;