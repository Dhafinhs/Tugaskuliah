import { useState, useEffect, useRef, createRef } from 'react';

function PlaceList({ places, onSelectPlace }) {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const placeRefs = useRef([]);

  // Sample data if backend is not yet available
  const samplePlaces = [
    {
      _id: '1',
      name: 'Cafe Delight',
      description: 'A cozy cafe with amazing pastries and coffee',
      address: '123 Main St, Cityville',
      category: 'Cafe',
      priceRange: '$$',
      images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
      overallRating: 4.5,
      reviewCount: 120
    },
    {
      _id: '2',
      name: 'Spice Garden',
      description: 'Authentic Indian cuisine with a modern twist',
      address: '456 Park Avenue, Townsville',
      category: 'Restaurant',
      priceRange: '$$$',
      images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
      overallRating: 4.8,
      reviewCount: 210
    },
    {
      _id: '3',
      name: 'Street Bites',
      description: 'The best street food from around the world',
      address: '789 Corner St, Villagetown',
      category: 'Street Food',
      priceRange: '$',
      images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
      overallRating: 4.2,
      reviewCount: 85
    },
  ];

  // For debugging - log the places prop and samplePlaces
  useEffect(() => {
    console.log('Places prop:', places);
    console.log('Sample places:', samplePlaces);
  }, [places]);

  useEffect(() => {
    // Always use sample data if no places are provided or if places is not an array
    const placesToUse = Array.isArray(places) && places.length > 0 ? places : samplePlaces;
    console.log('Using places for filtering:', placesToUse.length, 'items');
    
    // Filter and sort places
    let filtered;
    if (category === 'all') {
      filtered = placesToUse;
      console.log('Showing all places:', filtered.length);
    } else {
      filtered = placesToUse.filter(place => {
        const match = place.category === category;
        return match;
      });
      console.log(`Filtered to ${category}:`, filtered.length);
    }
    
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'rating') return b.overallRating - a.overallRating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0;
    });
    
    console.log('Final filtered and sorted places:', sorted.length);
    setFilteredPlaces(sorted);
    
    // Initialize placeRefs with the new length
    placeRefs.current = Array(sorted.length).fill().map((_, i) => placeRefs.current[i] || createRef());
  }, [places, category, sortBy]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers = [];
    
    placeRefs.current.forEach((ref, index) => {
      if (ref && ref.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          },
          { threshold: 0.1 }
        );
        
        observer.observe(ref.current);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach(observer => {
        observer.disconnect();
      });
    };
  }, [filteredPlaces]);

  // Check if any places exist for the current category
  const hasPlacesInCategory = filteredPlaces.length > 0;

  return (
    <div id="places" className="pt-16">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Discover Amazing Places</h2>
        <div className="w-20 h-1 bg-blue-500 mb-6"></div>
        <p className="text-center text-gray-600 max-w-2xl mb-8">
          Find the perfect spot for your next meal. Browse through our curated list of restaurants, cafes, and street food vendors.
        </p>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mb-8">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start flex-1">
            <button 
              onClick={() => setCategory('all')} 
              className={`px-4 py-2 rounded-full transition-all ${
                category === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setCategory('Restaurant')} 
              className={`px-4 py-2 rounded-full transition-all ${
                category === 'Restaurant' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Restaurants
            </button>
            <button 
              onClick={() => setCategory('Cafe')} 
              className={`px-4 py-2 rounded-full transition-all ${
                category === 'Cafe' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cafes
            </button>
            <button 
              onClick={() => setCategory('Street Food')} 
              className={`px-4 py-2 rounded-full transition-all ${
                category === 'Street Food' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Street Food
            </button>
          </div>
          
          <div className="flex justify-center md:justify-end items-center">
            <label className="text-gray-600 mr-2">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)} 
              className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Highest Rating</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hasPlacesInCategory ? (
          filteredPlaces.map((place, index) => (
            <div 
              key={place._id} 
              ref={el => placeRefs.current[index] = el}
              className="scroll-animation bg-white rounded-xl overflow-hidden card-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={place.images && place.images.length > 0 ? place.images[0] : 'https://via.placeholder.com/500x300?text=No+Image'} 
                  alt={place.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x300?text=Image+Error';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {place.category || 'Unknown'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {place.priceRange || '$'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{place.name}</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-medium">{place.overallRating?.toFixed(1) || 'New'}</span>
                    <span className="ml-1 text-gray-500 text-sm">({place.reviewCount || 0})</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {place.description 
                    ? (place.description.substring(0, 80) + (place.description.length > 80 ? '...' : '')) 
                    : 'No description available.'}
                </p>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{place.address || 'Address not available'}</span>
                </div>
                
                <button 
                  onClick={() => onSelectPlace(place)} 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No places found in this category</h3>
              <p className="text-gray-600 mb-4">
                {category === 'all'
                  ? "We don't have any places to show yet."
                  : `We don't have any ${category.toLowerCase()} places to show yet.`}
              </p>
              <button
                onClick={() => setCategory('all')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show All Places
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaceList;
