import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link dari react-router-dom

function Navbar({ onShowReviewForm }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#"
          className="text-2xl font-bold text-blue-600 flex items-center space-x-2"
          onClick={(e) => e.preventDefault()}
        >
          <span className="text-3xl">🍽️</span>
          <span>TastyReviews</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
          >
            Profile
          </Link>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => onShowReviewForm(null)} // Pass null for global review
          >
            Add Review
          </button>
        </div>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full animate-fadeDown">
          <div className="flex flex-col p-4 space-y-4">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
                setMobileMenuOpen(false);
              }}
              className="font-medium p-2 hover:bg-blue-50 rounded-md"
            >
              Home
            </a>
            <a 
              href="#places" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium p-2 hover:bg-blue-50 rounded-md"
            >
              Explore
            </a>
            <a 
              href="#top-rated" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium p-2 hover:bg-blue-50 rounded-md"
            >
              Top Rated
            </a>
            <a 
              href="#" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-medium p-2 hover:bg-blue-50 rounded-md"
            >
              About
            </a>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 
                        transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onShowReviewForm) onShowReviewForm(null); // Pass null for global review
              }}
            >
              Add Review
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
