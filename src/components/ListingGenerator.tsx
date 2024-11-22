import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_ENDPOINT = 'https://api.example.com/v1'; // Replace with your actual API endpoint

interface ContentData {
  title: string;
  description: string;
  images: string[];
  tags: string[];
  
}

interface ListingGeneratorProps {
  contentData: ContentData;
  files?: File[];
  url?: string;
}

export default function ListingGenerator({ contentData, files, url }: ListingGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [category, setCategory] = useState('');
  const [includes, setIncludes] = useState({
    images: true,
    description: true,
    features: true,
    keywords: true
  });

  const steps = [
    'Analyzing content...',
    'Extracting product details...',
    'Generating description...',
    'Creating listing...'
  ];

  const generateListing = async () => {
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        contentData,
        category,
        includes,
        sourceType: files ? 'files' : 'url',
        source: files ? undefined : url
      };

      const response = await axios.post(`${API_ENDPOINT}/generate-listing`, payload, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      let step = 0;
      const interval = setInterval(() => {
        if (step < steps.length - 1) {
          step++;
          setCurrentStep(step);
        } else {
          clearInterval(interval);
          setIsGenerating(false);
          toast.success('Listing generated successfully!');
          // Handle the generated listing data
          console.log('Generated listing:', response.data);
        }
      }, 1500);
    } catch (error) {
      console.error('Error generating listing:', error);
      toast.error('Failed to generate listing. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {isGenerating ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Generating Listing</h2>
              <div className="animate-pulse">
                <div className="h-2 w-24 bg-indigo-200 rounded"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center space-x-3 ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                    index < currentStep
                      ? 'bg-green-100 text-green-500'
                      : index === currentStep
                      ? 'bg-indigo-100 text-indigo-500'
                      : 'bg-gray-100'
                  }`}>
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Content Preview</h2>
              {contentData.images.length > 0 && (
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src={contentData.images[0]}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              )}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">{contentData.title}</h3>
                <p className="text-sm text-gray-600">{contentData.description}</p>
                <div className="flex flex-wrap gap-2">
                  {contentData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Listing Options</h2>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Category</span>
                  <select
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Kitchen</option>
                    <option value="sports">Sports & Outdoors</option>
                  </select>
                </label>
                
                <label className="block">
                  <div className="mt-1 flex items-center space-x-4">
                    
                    <span className="text-gray-500">-</span>
                   
                  </div>
                </label>
                
                <div className="space-y-2">
                  <span className="text-gray-700 text-sm font-medium">Include</span>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(includes).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setIncludes(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={generateListing}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Generate Listing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}