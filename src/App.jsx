import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ArchiveFunds from './pages/ArchiveFunds';
import Services from './pages/Services';
import Contacts from './pages/Contacts';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/funds" element={<ArchiveFunds />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
