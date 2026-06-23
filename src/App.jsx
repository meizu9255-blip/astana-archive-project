import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorFallback from "./components/GlobalErrorFallback";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ArchiveFunds from "./pages/ArchiveFunds";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Status from "./pages/Status";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UniversalAssistant from "./components/UniversalAssistant";
import ScrollToTop from "./components/ScrollToTop";
import { AccessibilityProvider } from "./AccessibilityContext";

function App() {
  return (
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <AccessibilityProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/funds" element={<ArchiveFunds />} />
                <Route path="/services" element={<Services />} />
                <Route path="/status" element={<Status />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <UniversalAssistant />
          </div>
        </BrowserRouter>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;
