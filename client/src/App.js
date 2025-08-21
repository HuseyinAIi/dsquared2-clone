import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add" element={<AddProduct />} />
            <Route path="/admin/edit/:id" element={<EditProduct />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// 404 Not Found component
const NotFound = () => {
  return (
    <div className="main-content">
      <div className="container">
        <div className="text-center">
          <h1 className="page-title">404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-primary">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
