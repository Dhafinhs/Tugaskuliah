import { useState } from 'react';

function ReviewForm({ placeId, onClose, onReviewAdded, initialValues = {} }) {
  const [formData, setFormData] = useState({
    userName: '',
    restaurantName: initialValues.restaurantName || '',
    category: initialValues.category || 'Restaurant',
    rating: 5,
    comment: '',
    visitDate: new Date().toISOString().split('T')[0],
    userProfile: 'https://randomuser.me/api/portraits/lego/1.jpg',
    address: initialValues.address || '',
    priceRange: initialValues.priceRange || '$$'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // If no placeId is provided, we need to create a new place first
      let reviewPlaceId = placeId;
      
      if (!reviewPlaceId) {
        // Create a new place
        const placeData = {
          name: formData.restaurantName,
          category: formData.category,
          description: `User-submitted ${formData.category.toLowerCase()}.`,
          address: formData.address || 'Unknown location',
          priceRange: formData.priceRange,
          images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
          overallRating: formData.rating,
          reviewCount: 1
        };
        
        console.log('Creating new place:', placeData);
        
        try {
          // Try to create place in backend
          const response = await fetch('http://localhost:5000/api/places', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(placeData),
          }).catch(err => {
            console.error('Fetch error:', err);
            return { ok: false };
          });
          
          if (response.ok) {
            const newPlace = await response.json();
            console.log('Place created successfully:', newPlace);
            reviewPlaceId = newPlace._id;
          } else {
            console.error('Failed to create place, using mock ID');
            // If backend fails, create a mock place ID
            reviewPlaceId = `mock-place-${Date.now()}`;
            
            // Create a mock place object to pass back to the main app
            const newPlace = {
              _id: reviewPlaceId,
              ...placeData
            };
            
            // Add the newly created place to the places list
            if (onReviewAdded) {
              console.log('Adding mock place to places list');
              onReviewAdded(null, newPlace);
              onClose();
              return; // Return early to prevent further processing
            }
          }
        } catch (err) {
          console.error('Error creating place:', err);
          
          // Create a mock place with all the data
          const mockPlace = {
            _id: `mock-place-${Date.now()}`,
            name: formData.restaurantName,
            category: formData.category,
            description: `User-submitted ${formData.category.toLowerCase()}.`,
            address: formData.address || 'Unknown location',
            priceRange: formData.priceRange,
            images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'],
            overallRating: formData.rating,
            reviewCount: 1
          };
          
          if (onReviewAdded) {
            console.log('Adding error-case mock place to places list');
            onReviewAdded(null, mockPlace);
            onClose();
            return; // Return early to prevent further processing
          }
        }
      }
      
      // Now create the review
      const reviewData = {
        placeId: reviewPlaceId,
        userName: formData.userName,
        rating: formData.rating,
        comment: formData.comment,
        visitDate: formData.visitDate,
        userProfile: formData.userProfile
      };
      
      console.log('Creating review for place:', reviewPlaceId, reviewData);
      
      // Try to send the review to the backend
      try {
        const reviewResponse = await fetch('http://localhost:5000/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        }).catch(err => {
          console.error('Review fetch error:', err);
          return { ok: false };
        });
        
        if (reviewResponse.ok) {
          const savedReview = await reviewResponse.json();
          console.log('Review saved successfully:', savedReview);
          if (onReviewAdded) onReviewAdded(savedReview);
        } else {
          console.error('Failed to create review, using mock review');
          // Create a mock review
          const mockReview = {
            _id: `mock-${Date.now()}`,
            ...reviewData,
            visitDate: new Date(formData.visitDate),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          if (onReviewAdded) onReviewAdded(mockReview);
        }
      } catch (err) {
        console.error('Error creating review:', err);
        // Create a mock review in case of failure
        const mockReview = {
          _id: `mock-${Date.now()}`,
          ...reviewData,
          visitDate: new Date(formData.visitDate),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        if (onReviewAdded) onReviewAdded(mockReview);
      }
      
      onClose();
    } catch (err) {
      console.error('Error in review submission process:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stop propagation of clicks inside the modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
      style={{ backdropFilter: 'blur(5px)' }}
    >
      <div 
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Write a Review</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Your Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter restaurant name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter restaurant address"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Street Food">Street Food</option>
                <option value="Bakery">Bakery</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price Range</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
                <option value="$$$$">$$$$ (Very Expensive)</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Rating</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className="focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-8 w-8 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-gray-600">
                {formData.rating}/5
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Your Review</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Share your experience with this place..."
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Visit Date</label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
