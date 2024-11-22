import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ListingsPage from './pages/ListingsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <main className="py-12">
                <UploadSection />
              </main>
            </>
          } />
          <Route path="/listings" element={<ListingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;