import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import PublicLayout from './components/PublicLayout/PublicLayout'

// Public Pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Catalog from './pages/public/Catalog'
import CertificatesPublic from './pages/public/Certificates'
import Contact from './pages/public/Contact'

// Auth
import Login from './pages/Login'

// CMS Admin Pages
import Dashboard from './pages/Dashboard'
import Products from './pages/Products/Products'
import ProductForm from './pages/Products/ProductForm'
import Categories from './pages/Categories/Categories'
import HomeContent from './pages/HomeContent/HomeContent'
import Services from './pages/Services/Services'
import Branches from './pages/Branches/Branches'
import AboutSettings from './pages/AboutSettings/AboutSettings'
import ContactSettings from './pages/ContactSettings/ContactSettings'
import FooterSettings from './pages/FooterSettings/FooterSettings'
import Leadership from './pages/Leadership/Leadership'
import Objectives from './pages/Objectives/Objectives'
import Metrics from './pages/Metrics/Metrics'
import Accreditations from './pages/Accreditations/Accreditations'
import CertificatesAdmin from './pages/Certificates/Certificates'
import CertificateForm from './pages/Certificates/CertificateForm'
import ContactMessages from './pages/ContactMessages/ContactMessages'
import AuditLog from './pages/AuditLog/AuditLog'
import Users from './pages/Users/Users'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* ── Public Website Routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/services" element={<Navigate to="/catalog" replace />} />
        <Route path="/certificates" element={<CertificatesPublic />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ── Login Route ── */}
      <Route path="/login" element={<Login />} />

      {/* ── Protected CMS Routes (Full admin dashboard) ── */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/home-content" element={<HomeContent />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/about-settings" element={<AboutSettings />} />
        <Route path="/contact-settings" element={<ContactSettings />} />
        <Route path="/footer-settings" element={<FooterSettings />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/objectives" element={<Objectives />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/accreditations" element={<Accreditations />} />
        <Route path="/admin/certificates" element={<CertificatesAdmin />} />
        <Route path="/admin/certificates/new" element={<CertificateForm />} />
        <Route path="/admin/certificates/:id/edit" element={<CertificateForm />} />
        <Route path="/contact-messages" element={<ContactMessages />} />
        <Route path="/audit-log" element={<AuditLog />} />
        <Route path="/users" element={<Users />} />
      </Route>

      {/* ── 404 Fallback ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
