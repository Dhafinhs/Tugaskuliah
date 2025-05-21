import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Import halaman Home
import PlaceDetail from './components/PlaceDetail';
import ReviewForm from './components/ReviewForm';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [places, setPlaces] = useState([]);
  const [showGlobalReviewForm, setShowGlobalReviewForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/places');
        if (response.ok) {
          const data = await response.json();
          setPlaces(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchPlaces();
  }, []);

  const handleShowReviewForm = (placeId) => {
    setShowGlobalReviewForm({ placeId });
  };

  const handleReviewAdded = (review, newPlace) => {
    if (newPlace) {
      setPlaces((prevPlaces) => [newPlace, ...prevPlaces]);
    }

    // Update user data locally
    setUser((prevUser) => ({
      ...prevUser,
      reviewsCount: prevUser.reviewsCount + 1, // Increment reviews count
      xp: prevUser.xp + 10, // Add 10 XP
    }));

    setShowGlobalReviewForm(false);
  };

  const handleLogin = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please login.');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    setUser(null); // Set state user ke null
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-full">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Home
                  user={user}
                  places={places}
                  onShowReviewForm={handleShowReviewForm}
                  onReviewAdded={handleReviewAdded}
                />
              ) : (
                <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
              )
            }
          />
          <Route path="/place/:id" element={<PlaceDetail user={user} />} /> {/* Pastikan user diteruskan */}
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} /> {/* Logout hanya di halaman profil */}
        </Routes>
        {showGlobalReviewForm && (
          <ReviewForm
            placeId={showGlobalReviewForm.placeId}
            onClose={() => setShowGlobalReviewForm(false)}
            onReviewAdded={handleReviewAdded}
            user={user} // Pass user to ReviewForm
          />
        )}
      </div>
    </Router>
  );
}

export default App;
