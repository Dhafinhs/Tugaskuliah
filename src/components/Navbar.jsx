import { useState, useEffect } from 'react';

function Navbar({ onShowReviewForm }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          className="text-2xl font-bold flex items-center space-x-2"
        >
          <span className="text-3xl">🍽️</span>
          <span className={`${isScrolled ? 'text-blue-600' : 'text-white'} font-extrabold text-shadow-sm`}>
            TastyReviews
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            className={`font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-800' : 'text-white font-semibold'}`}
          >
            Home
          </a>
          <a 
            href="#places" 
            className={`font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-800' : 'text-white font-semibold'}`}
          >
            Explore
          </a>
          <a 
            href="#top-rated" 
            className={`font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-800' : 'text-white font-semibold'}`}
          >
            Top Rated
          </a>
          <a 
            href="#" 
            className={`font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-800' : 'text-white font-semibold'}`}
          >
            About
          </a>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 
                      transition-colors transform hover:scale-105 duration-200"
            onClick={onShowReviewForm}
          >
            Add Review
          </button>
        </div>

        {/* Mobile Navigation Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden text-gray-600"
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
                if (onShowReviewForm) onShowReviewForm();
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
