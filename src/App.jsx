import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlaceList from './components/PlaceList';
import PlaceDetail from './components/PlaceDetail';
import ReviewForm from './components/ReviewForm';
import './App.css';

function App() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGlobalReviewForm, setShowGlobalReviewForm] = useState(false);

  useEffect(() => {
    // Fetch places from backend
    const fetchPlaces = async () => {
      try {
        console.log('Fetching places from backend...');
        setLoading(true);
        
        // For development/testing, we'll catch the error and use empty array
        // so the app doesn't break if backend is not running
        let success = false;
        let data = [];
        
        try {
          const response = await fetch('http://localhost:5000/api/places');
          if (response.ok) {
            data = await response.json();
            success = true;
            console.log('Fetched data successfully:', data);
          } else {
            console.warn('Backend returned error status:', response.status);
          }
        } catch (err) {
          console.error('Fetch error:', err);
        }
        
        if (!success) {
          console.log('Using default sample data instead');
          // We'll let the PlaceList component use its sample data
        } else if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
          data = [];
        }
        
        setPlaces(data);
        setLoading(false);
      } catch (err) {
        console.error('Error in fetch process:', err);
        setPlaces([]);
        setLoading(false);
      }
    };

    fetchPlaces();
    
    // Debugging: Check MongoDB connection status
    fetch('http://localhost:5000/')
      .then(res => res.text())
      .then(text => console.log('Backend status:', text))
      .catch(err => console.error('Cannot reach backend:', err));
      
  }, []);

  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
    setSelectedPlace(place);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedPlace(null);
  };
  
  const handleShowReviewForm = () => {
    setShowGlobalReviewForm(true);
  };

  const handleReviewAdded = (review, newPlace) => {
    // If a new place was created, add it to the places list
    if (newPlace) {
      console.log('Adding new place to places list:', newPlace);
      setPlaces(prevPlaces => {
        // Make sure prevPlaces is an array
        const safeArray = Array.isArray(prevPlaces) ? prevPlaces : [];
        return [newPlace, ...safeArray];
      });
      
      // Refresh the places from backend to ensure we have the latest data
      fetch('http://localhost:5000/api/places')
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Failed to refresh places');
        })
        .then(data => {
          console.log('Places refreshed:', data);
          if (Array.isArray(data)) {
            setPlaces(data);
          }
        })
        .catch(err => console.error('Error refreshing places:', err));
    } 
    
    // If a review was added to an existing place, update its rating
    else if (review && places.length > 0) {
      console.log('Updating place ratings for new review:', review);
      setPlaces(prevPlaces => 
        prevPlaces.map(place => 
          place._id === review.placeId 
            ? {
                ...place,
                overallRating: (place.overallRating * place.reviewCount + review.rating) / (place.reviewCount + 1),
                reviewCount: place.reviewCount + 1
              }
            : place
        )
      );
    }
    
    // Close the review form
    setShowGlobalReviewForm(false);
    
    // Scroll to the places section
    setTimeout(() => {
      const placesSection = document.getElementById('places');
      if (placesSection) {
        placesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar onShowReviewForm={handleShowReviewForm} />
      {!selectedPlace && <HeroSection onShowReviewForm={handleShowReviewForm} />}
      
      <main className={selectedPlace ? "container mx-auto px-4 py-8" : "w-full px-4 py-8"}>
        {selectedPlace ? (
          <PlaceDetail place={selectedPlace} onBack={handleBackToList} />
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <PlaceList 
                places={places} 
                onSelectPlace={handlePlaceSelect} 
              />
            )}
          </>
        )}
      </main>
      
      {/* Global Review Form */}
      {showGlobalReviewForm && (
        <ReviewForm
          onClose={() => setShowGlobalReviewForm(false)}
          onReviewAdded={handleReviewAdded}
        />
      )}
    </div>
  );
}

export default App;
