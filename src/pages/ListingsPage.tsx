import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { generateDummyListings } from '../data/dummyData';

interface ListingData {
  title: string;
  description: string;
  category: string;
  images: string[];
  features: string[];
  keywords: string[];
}

export default function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { contentData } = location.state || {};

  useEffect(() => {
    if (!contentData) {
      navigate('/');
      return;
    }

    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyListings = generateDummyListings(contentData);
      setListings(dummyListings);
      setIsLoading(false);
    }, 2000);
  }, [contentData, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600">Generating listings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Upload
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Generated Listings</h1>
        </div>

        <div className="grid gap-8">
          {listings.map((listing, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{listing.title}</h2>
                  <span className="text-2xl font-bold text-indigo-600">
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    {listing.images.length > 0 && (
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-2 text-gray-700">{listing.description}</p>
                    </div>

                    {listing.features.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Key Features</h3>
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          {listing.features.map((feature, idx) => (
                            <li key={idx} className="text-gray-700">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {listing.keywords.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Keywords</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {listing.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <a
                        href="https://sellercentral.amazon.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Create Listing on Amazon
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}