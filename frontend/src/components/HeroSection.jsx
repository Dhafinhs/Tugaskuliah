import { useState, useEffect } from 'react';

function HeroSection({ onShowReviewForm }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-screen flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 -right-20 w-60 h-60 bg-pink-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className={`md:w-1/2 text-white mb-10 md:mb-0 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover & Share <span className="text-yellow-300">Culinary Experiences</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Explore the best restaurants, cafés and street food around you. Share your experiences and help others find their next favorite spot.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#places" className="bg-white text-blue-600 py-3 px-8 rounded-full text-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105 duration-200">
                Explore Places
              </a>
              <button 
                className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full text-lg font-medium hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 duration-200"
                onClick={onShowReviewForm}
              >
                Add Review
              </button>
            </div>
          </div>
          
          <div className={`md:w-1/2 flex justify-center transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 absolute animate-ping-slow opacity-60 inset-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80" 
                alt="Restaurant" 
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 font-bold">4.9/5</span>
                </div>
                <p className="mt-1 text-sm">Based on 200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 w-full text-center text-white">
        <a href="#places" className="inline-block animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default HeroSection;
