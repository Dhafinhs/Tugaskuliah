import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import PlaceList from '../components/PlaceList';

function Home({ user, places, onShowReviewForm, onReviewAdded, onLogout }) {
  return (
    <>
      <Navbar onShowReviewForm={onShowReviewForm} onLogout={onLogout} />
      <HeroSection onShowReviewForm={onShowReviewForm} />
      <main className="w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">All Restaurants</h1>
        <PlaceList places={places} />
      </main>
    </>
  );
}

export default Home;
