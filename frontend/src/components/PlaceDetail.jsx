import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import Navbar from './Navbar'; // Import Navbar

function PlaceDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    name: 'Loading...',
    description: 'Loading description...',
    images: [],
    address: 'Loading address...',
    category: 'Loading category...',
    priceRange: 'Loading price range...',
    overallRating: 0,
    reviewCount: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Default backup image if the main image fails to load
  const backupImage = 'https://via.placeholder.com/800x400?text=No+Image';

  // Handle image errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Get the correct image source with fallbacks
  const getImageSource = () => {
    if (imageError) return backupImage;
    if (!place?.images || place.images.length === 0) return backupImage;
    return place.images[currentImageIndex] || backupImage;
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/places/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPlace(data);
        }
      } catch (err) {
        console.error('Error fetching place details:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/place/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchPlace();
    fetchReviews();
  }, [id]);

  const handleAddReview = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  return (
    <>
      <Navbar user={user} /> {/* Tambahkan Navbar */}
      <div className="fade-in">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Places
        </button>

        {/* Hero Image */}
        <div className="relative h-80 rounded-xl overflow-hidden mb-8">
          <img
            src={getImageSource()}
            alt={place.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          {place.images && place.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {place.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setImageError(false);
                    setCurrentImageIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex justify-between items-end">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{place.name}</h1>
              <div className="flex items-center bg-white/90 px-3 py-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 font-bold">{place.overallRating}</span>
                <span className="ml-1 text-gray-600">({place.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700 mb-6">{place.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p>{place.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price Range</h3>
                    <p>{place.priceRange}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start">
                        <img
                          src={review.userProfile}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-bold">{review.userName}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(review.visitDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex text-yellow-400 my-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-gray-700 mt-2">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Map & More Info */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-md mb-8">
              <h3 className="text-lg font-bold mb-4">Location</h3>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
              <p className="text-gray-700">{place.address}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-4">Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            placeId={place._id}
            onClose={() => setShowReviewForm(false)}
            onReviewAdded={handleAddReview}
            user={user} // Pass user to ReviewForm
            initialValues={{
              restaurantName: place.name,
              category: place.category,
              address: place.address,
              priceRange: place.priceRange,
            }}
            addXp={false} // Disable XP addition for reviews from detail page
          />
        )}
      </div>
    </>
  );
}

export default PlaceDetail;
