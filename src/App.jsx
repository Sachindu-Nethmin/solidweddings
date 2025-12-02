import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Contact1 from './pages/Contact1';
import Contact2 from './pages/Contact2';
import Contact3 from './pages/Contact3';
import BookPhotographer from './pages/BookPhotographer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-me" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/book-now" element={<BookPhotographer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact1" element={<Contact1 />} />
            <Route path="/contact2" element={<Contact2 />} />
            <Route path="/contact3" element={<Contact3 />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
