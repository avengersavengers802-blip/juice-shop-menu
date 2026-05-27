import React, { useState, useEffect, useCallback } from 'react';
import { menuData } from '../data/menu.js';
import './AdminPage.css';

// ── Hardcoded admin credentials ─────────────────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'fizztaa@2024';

// ── Helpers ──────────────────────────────────────────────────────────────────
const getAllCustomerKeys = () =>
    Object.keys(localStorage).filter(k => k.startsWith('fizztaa_orders_'));

const getAllOrders = () => {
    const keys = getAllCustomerKeys();
    const all = [];
    keys.forEach(key => {
        const phone = key.replace('fizztaa_orders_', '');
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        orders.forEach(o => all.push({ ...o, customerPhone: phone }));
    });
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const getAllCustomers = () => {
    const keys = getAllCustomerKeys();
    return keys.map(key => {
        const phone = key.replace('fizztaa_orders_', '');
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        const total = orders.reduce((s, o) => s + o.total, 0);
        return { phone, orderCount: orders.length, totalSpent: total, lastOrder: orders[0]?.timestamp || null };
    });
};

const getOrderStatus = (timestamp) => {
    const elapsed = (Date.now() - new Date(timestamp).getTime()) / 1000;
    if (elapsed < 15)  return { text: 'Order Received', color: '#3a86c8', icon: '📝', step: 0 };
    if (elapsed < 45)  return { text: 'Preparing',      color: '#ffb703', icon: '🍋', step: 1 };
    if (elapsed < 90)  return { text: 'Out for Delivery',color: '#fb8500', icon: '🛵', step: 2 };
    return               { text: 'Delivered',            color: '#2a9d8f', icon: '🎉', step: 3 };
};

// ── Admin Page ───────────────────────────────────────────────────────────────
const AdminPage = ({ onExit }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('fizztaa_admin') === 'true');
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [tick, setTick] = useState(0);
    const [orderSearch, setOrderSearch] = useState('');
    const [menuSearch, setMenuSearch] = useState('');
    const [menuFilter, setMenuFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const refreshData = useCallback(() => {
        setOrders(getAllOrders());
        setCustomers(getAllCustomers());
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isLoggedIn) refreshData();
    }, [isLoggedIn, refreshData]);

    // Live tick every 5s for status updates
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 5000);
        return () => clearInterval(id);
    }, []);

    // ── Stats ────────────────────────────────────────────────────────────────
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const todayOrders = orders.filter(o => {
        const d = new Date(o.timestamp);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    });
    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

    // ── Login ────────────────────────────────────────────────────────────────
    const handleLogin = (e) => {
        e.preventDefault();
        if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
            sessionStorage.setItem('fizztaa_admin', 'true');
            setIsLoggedIn(true);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials. Try admin / fizztaa@2024');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('fizztaa_admin');
        setIsLoggedIn(false);
    };

    // ── Filtered data ────────────────────────────────────────────────────────
    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch)
    );

    const filteredMenu = menuData.items.filter(item => {
        const matchCat = menuFilter === 'all' || item.categoryId === menuFilter;
        const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
        return matchCat && matchSearch;
    });

    // ── Login screen ─────────────────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-card">
                    <div className="admin-login-logo">
                        <span>🥤</span>
                        <h1>Fizztaa Admin</h1>
                        <p>Management Dashboard</p>
                    </div>
                    <form onSubmit={handleLogin} className="admin-login-form">
                        {loginError && <div className="admin-login-error">{loginError}</div>}
                        <div className="admin-field">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="admin"
                                value={loginUser}
                                onChange={e => setLoginUser(e.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-field">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={loginPass}
                                onChange={e => setLoginPass(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="admin-login-btn">Login to Dashboard →</button>
                    </form>
                    <button className="admin-back-link" onClick={onExit}>← Back to Menu</button>
                </div>
            </div>
        );
    }

    // ── Main Dashboard ────────────────────────────────────────────────────────
    return (
        <div className="admin-page">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span className="admin-brand-icon">🥤</span>
                    <div>
                        <span className="admin-brand-name">Fizztaa</span>
                        <span className="admin-brand-label">Admin Panel</span>
                    </div>
                </div>
                <nav className="admin-nav">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                        { id: 'orders',    label: 'All Orders', icon: '📦' },
                        { id: 'customers', label: 'Customers',  icon: '👥' },
                        { id: 'menu',      label: 'Menu Items', icon: '🍹' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="nav-icon">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-sidebar-back" onClick={onExit}>← Customer View</button>
                    <button className="admin-sidebar-logout" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top bar */}
                <header className="admin-topbar">
                    <h2 className="admin-page-title">
                        {activeTab === 'dashboard' && '📊 Dashboard Overview'}
                        {activeTab === 'orders'    && '📦 All Orders'}
                        {activeTab === 'customers' && '👥 Customer Database'}
                        {activeTab === 'menu'      && '🍹 Menu Management'}
                    </h2>
                    <div className="admin-topbar-right">
                        <button className="admin-refresh-btn" onClick={refreshData}>↻ Refresh</button>
                        <span className="admin-admin-badge">👤 Admin</span>
                    </div>
                </header>

                {/* ── DASHBOARD TAB ─────────────────────────────────────────── */}
                {activeTab === 'dashboard' && (
                    <div className="admin-tab-content">
                        <div className="admin-stats-grid">
                            <div className="admin-stat-card primary">
                                <div className="stat-icon">📦</div>
                                <div className="stat-body">
                                    <span className="stat-value">{orders.length}</span>
                                    <span className="stat-label">Total Orders</span>
                                </div>
                            </div>
                            <div className="admin-stat-card green">
                                <div className="stat-icon">💰</div>
                                <div className="stat-body">
                                    <span className="stat-value">₹{totalRevenue}</span>
                                    <span className="stat-label">Total Revenue</span>
                                </div>
                            </div>
                            <div className="admin-stat-card blue">
                                <div className="stat-icon">👥</div>
                                <div className="stat-body">
                                    <span className="stat-value">{customers.length}</span>
                                    <span className="stat-label">Total Customers</span>
                                </div>
                            </div>
                            <div className="admin-stat-card yellow">
                                <div className="stat-icon">🗓️</div>
                                <div className="stat-body">
                                    <span className="stat-value">{todayOrders.length}</span>
                                    <span className="stat-label">Today's Orders</span>
                                </div>
                            </div>
                            <div className="admin-stat-card orange">
                                <div className="stat-icon">🏷️</div>
                                <div className="stat-body">
                                    <span className="stat-value">₹{todayRevenue}</span>
                                    <span className="stat-label">Today's Revenue</span>
                                </div>
                            </div>
                            <div className="admin-stat-card purple">
                                <div className="stat-icon">🍹</div>
                                <div className="stat-body">
                                    <span className="stat-value">{menuData.items.length}</span>
                                    <span className="stat-label">Menu Items</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h3>Recent Orders</h3>
                                <button className="admin-view-all-btn" onClick={() => setActiveTab('orders')}>View All →</button>
                            </div>
                            {orders.length === 0 ? (
                                <div className="admin-empty">No orders yet. Orders will appear here once customers start purchasing.</div>
                            ) : (
                                <div className="admin-table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 8).map(order => {
                                                const status = getOrderStatus(order.timestamp);
                                                return (
                                                    <tr key={order.id + order.customerPhone}>
                                                        <td><span className="order-id-chip">{order.id}</span></td>
                                                        <td>📞 {order.customerPhone}</td>
                                                        <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                                                        <td><strong>₹{order.total}</strong></td>
                                                        <td>
                                                            <span className="status-pill" style={{ background: `${status.color}20`, color: status.color }}>
                                                                {status.icon} {status.text}
                                                            </span>
                                                        </td>
                                                        <td className="muted">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── ORDERS TAB ────────────────────────────────────────────── */}
                {activeTab === 'orders' && (
                    <div className="admin-tab-content">
                        <div className="admin-toolbar">
                            <div className="admin-search-box">
                                <span>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by Order ID or phone..."
                                    value={orderSearch}
                                    onChange={e => setOrderSearch(e.target.value)}
                                />
                            </div>
                            <span className="admin-count-badge">{filteredOrders.length} orders</span>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="admin-empty">
                                {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
                            </div>
                        ) : (
                            <div className="admin-orders-list">
                                {filteredOrders.map(order => {
                                    const status = getOrderStatus(order.timestamp);
                                    const isExpanded = expandedOrder === order.id + order.customerPhone;
                                    return (
                                        <div key={order.id + order.customerPhone} className={`admin-order-card ${isExpanded ? 'expanded' : ''}`}>
                                            <div
                                                className="admin-order-card-header"
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id + order.customerPhone)}
                                            >
                                                <div className="order-card-left">
                                                    <span className="order-id-chip">{order.id}</span>
                                                    <span className="order-customer">📞 {order.customerPhone}</span>
                                                </div>
                                                <div className="order-card-right">
                                                    <span className="status-pill" style={{ background: `${status.color}20`, color: status.color }}>
                                                        {status.icon} {status.text}
                                                    </span>
                                                    <strong className="order-price">₹{order.total}</strong>
                                                    <span className="order-date muted">
                                                        {new Date(order.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                                                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
                                                </div>
                                            </div>
                                            {isExpanded && (
                                                <div className="admin-order-card-body">
                                                    {/* Progress tracker */}
                                                    <div className="admin-progress-track">
                                                        {[
                                                            { label: 'Received',   icon: '📝' },
                                                            { label: 'Preparing',  icon: '🍋' },
                                                            { label: 'Delivery',   icon: '🛵' },
                                                            { label: 'Delivered',  icon: '🎉' },
                                                        ].map((step, i) => (
                                                            <React.Fragment key={step.label}>
                                                                <div className={`adm-step ${status.step >= i ? 'done' : ''}`}>
                                                                    <div className="adm-step-dot">{step.icon}</div>
                                                                    <span>{step.label}</span>
                                                                </div>
                                                                {i < 3 && <div className={`adm-step-line ${status.step > i ? 'done' : ''}`} />}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                    {/* Items */}
                                                    <div className="admin-order-items">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="admin-order-item-row">
                                                                <span className="item-emoji">{item.emoji}</span>
                                                                <span className="item-name">{item.name}</span>
                                                                <span className="item-size muted">{item.sizeLabel}</span>
                                                                <span className="item-qty">× {item.quantity}</span>
                                                                <span className="item-subtotal">₹{item.price * item.quantity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="admin-order-footer">
                                                        <span>Order Total</span>
                                                        <strong>₹{order.total}</strong>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── CUSTOMERS TAB ─────────────────────────────────────────── */}
                {activeTab === 'customers' && (
                    <div className="admin-tab-content">
                        {customers.length === 0 ? (
                            <div className="admin-empty">No customers yet. They'll appear here after their first order.</div>
                        ) : (
                            <>
                                <div className="admin-toolbar">
                                    <span className="admin-count-badge">{customers.length} customer{customers.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="admin-table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Mobile Number</th>
                                                <th>Orders</th>
                                                <th>Total Spent</th>
                                                <th>Last Order</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers
                                                .sort((a, b) => b.totalSpent - a.totalSpent)
                                                .map((c, i) => (
                                                <tr key={c.phone}>
                                                    <td className="muted">{i + 1}</td>
                                                    <td>
                                                        <span className="customer-phone">📞 {c.phone}</span>
                                                    </td>
                                                    <td>
                                                        <span className="order-count-pill">{c.orderCount}</span>
                                                    </td>
                                                    <td><strong className="revenue-cell">₹{c.totalSpent}</strong></td>
                                                    <td className="muted">
                                                        {c.lastOrder
                                                            ? new Date(c.lastOrder).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── MENU TAB ──────────────────────────────────────────────── */}
                {activeTab === 'menu' && (
                    <div className="admin-tab-content">
                        <div className="admin-toolbar">
                            <div className="admin-search-box">
                                <span>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search menu items..."
                                    value={menuSearch}
                                    onChange={e => setMenuSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="admin-category-filter"
                                value={menuFilter}
                                onChange={e => setMenuFilter(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {menuData.categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                                ))}
                            </select>
                            <span className="admin-count-badge">{filteredMenu.length} items</span>
                        </div>

                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Item</th>
                                        <th>Category</th>
                                        <th>Small</th>
                                        <th>Medium</th>
                                        <th>Large</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMenu.map(item => {
                                        const cat = menuData.categories.find(c => c.id === item.categoryId);
                                        return (
                                            <tr key={item.id}>
                                                <td className="muted">#{item.id}</td>
                                                <td>
                                                    <div className="menu-item-cell">
                                                        <span className="menu-emoji" style={{ background: `${item.color}22` }}>{item.emoji}</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="category-pill">{cat?.emoji} {cat?.name}</span>
                                                </td>
                                                <td><span className="price-chip">₹{item.prices[0]}</span></td>
                                                <td><span className="price-chip">₹{item.prices[1]}</span></td>
                                                <td><span className="price-chip">₹{item.prices[2]}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Keep tick in use to trigger status refresh */}
            <span style={{ display: 'none' }}>{tick}</span>
        </div>
    );
};

export default AdminPage;
