import Navbar from './Navbar'; // Import Navbar

function Profile({ user, onLogout }) {
  return (
    <>
      <Navbar /> {/* Tambahkan Navbar */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-16">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Rank:</span> {user.rank}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">XP:</span> {user.xp}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Reviews Count:</span> {user.reviewsCount}
          </p>
        </div>
        <button
          onClick={onLogout} // Logout hanya di halaman profil
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Profile;
