import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CITY_OPTIONS = [
  'Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Yogyakarta', 'Bali', 'Makassar', 'Palembang', 'Batam', 'Malang', 'Pekanbaru', 'Samarinda', 'Banjarmasin', 'Pontianak', 'Ambon', 'Kupang', 'Manado', 'Jayapura', 'Mataram', 'Bandar Lampung', 'Cirebon', 'Tasikmalaya', 'Sukabumi', 'Cimahi', 'Tangerang Selatan', 'Lainnya'
];

function PlaceList({ places, onSelectPlace }) {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedCity, setSelectedCity] = useState('all');
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    let filtered = [...places];

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(place => place.category === category);
    }

    // Filter by selected city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(place => place.city === selectedCity);
    }

    // Sort by rating or reviews
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.overallRating - a.overallRating);
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    setFilteredPlaces(filtered);
  }, [places, category, sortBy, selectedCity]);

  const handleSelectPlace = (place) => {
    onSelectPlace(place);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

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

          {/* Filter kota dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-gray-600">Filter City:</label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              {CITY_OPTIONS.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center md:justify-end items-center">
            <label className="text-gray-600 mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Highest Rating</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Places Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => (
            <Link
              to={`/place/${place._id}`}
              key={place._id}
              className="bg-white rounded-xl overflow-hidden card-shadow hover-scale"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={place.images && place.images.length > 0 ? place.images[0] : 'https://via.placeholder.com/500x300?text=No+Image'}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{place.name}</h3>
                <p className="text-gray-600 mb-4">
                  {place.description ? place.description.substring(0, 80) + '...' : 'No description available.'}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{place.category}</span>
                  <span className="text-sm text-gray-500">{place.priceRange}</span>
                </div>
                <div className="text-sm text-gray-500">City: {place.city || '-'}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No places available to display.</div>
      )}
    </div>
  );
}

export default PlaceList;
