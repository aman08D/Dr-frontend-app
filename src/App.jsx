import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Doctors from './pages/Doctors';
import Workers from './pages/Workers';
import Login from './pages/Login';
import Venues from './pages/Venues';


// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminDoctors from './pages/AdminDoctors';
import AdminWorkers from './pages/AdminWorkers'; //
import AdminVenues from './pages/AdminVenues';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/venues" element={<Venues />} />
            


            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/workers" element={<AdminWorkers />} />
            <Route path="/admin/venues" element={<AdminVenues />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;