import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CaterersMenu } from './pages/CaterersMenu';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';

// Admin Pages
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageCakes } from './pages/admin/ManageCakes';
import { ManageOrders } from './pages/admin/ManageOrders';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { ManageCaterers } from './pages/admin/ManageCaterers';
import { ManageWhatsapp } from './pages/admin/ManageWhatsapp';
import { ForgotPassword } from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            
            <div className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/caterers" element={<CaterersMenu />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Console Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/cakes"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ManageCakes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/caterers"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ManageCaterers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ManageOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/whatsapp"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ManageWhatsapp />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
