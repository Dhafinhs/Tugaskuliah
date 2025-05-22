import { useEffect, useState } from 'react';
import Navbar from './Navbar';

function AdminDashboard({ user }) {
  const [places, setPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) return;
    const fetchData = async () => {
      const placesRes = await fetch('http://localhost:5000/api/places');
      const reviewsRes = await fetch('http://localhost:5000/api/reviews/place/all');
      setPlaces(await placesRes.json());
      setReviews(await reviewsRes.json());
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleDeletePlace = async (id) => {
    if (!window.confirm('Delete this place?')) return;
    await fetch(`http://localhost:5000/api/places/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setPlaces(places.filter(p => p._id !== id));
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await fetch(`http://localhost:5000/api/reviews/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setReviews(reviews.filter(r => r._id !== id));
  };

  if (!user?.isAdmin) return <div className="p-8 text-red-600">Not authorized</div>;
  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <Navbar user={user} />
      <div className="max-w-5xl mx-auto mt-24 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <h3 className="text-xl font-semibold mt-6 mb-2">All Places</h3>
        <table className="w-full mb-8">
          <thead>
            <tr>
              <th>Name</th><th>Category</th><th>City</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {places.map(place => (
              <tr key={place._id}>
                <td>{place.name}</td>
                <td>{place.category}</td>
                <td>{place.city}</td>
                <td>
                  <button className="text-red-600" onClick={() => handleDeletePlace(place._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="text-xl font-semibold mt-6 mb-2">All Reviews</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>User</th><th>PlaceId</th><th>Rating</th><th>Comment</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review._id}>
                <td>{review.userName}</td>
                <td>{review.placeId}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>
                  <button className="text-red-600" onClick={() => handleDeleteReview(review._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminDashboard;
