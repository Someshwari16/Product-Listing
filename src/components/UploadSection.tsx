import { Link, Upload, Search } from 'lucide-react';
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

// Define the ContentData interface
interface ContentData {
  title: string;
  description: string;
  images: string[];
  tags: string[];
  price?: number;
}

export default function UploadSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('url');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'url', icon: Link, label: 'URL' },
    { id: 'upload', icon: Upload, label: 'Upload' },
  ];

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleFiles(droppedFiles);
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      await handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isUnderSize = file.size <= 50 * 1024 * 1024; // 50 MB
      return isValid && isUnderSize;
    });

    if (validFiles.length === 0) {
      toast.error('Please upload valid image or video files under 50MB');
      return;
    }

    setFiles(validFiles);
    await analyzeFiles(validFiles);
  };

  const analyzeFiles = async (filesToAnalyze: File[]) => {
    setIsLoading(true);

    try {
      const dummyContentData: ContentData = {
        title: 'Amazing Product from Social Media',
        description: 'This incredible product was featured in a viral social media post. Perfect for modern lifestyle enthusiasts.',
        images: filesToAnalyze.map(file => URL.createObjectURL(file)),
        tags: ['trending', 'viral', 'lifestyle'],
        price: 99.99,
      };

      setTimeout(() => {
        navigate('/listings', {
          state: {
            contentData: dummyContentData,
            sourceType: 'files',
          },
        });
        setIsLoading(false);
      }, 1500); // Simulate API delay
    } catch (error) {
      console.error('Error analyzing files:', error);
      toast.error('Failed to analyze content. Please try again.');
      setIsLoading(false);
    }
  };

  const analyzeUrl = async () => {
    if (!url) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      const dummyContentData: ContentData = {
        title: `Trending Product from ${new URL(url).hostname}`,
        description: 'Discover this amazing product that is taking social media by storm. Featured in multiple viral posts.',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        ],
        tags: ['viral', 'trending', 'musthave'],
        price: 149.99,
      };

      setTimeout(() => {
        navigate('/listings', {
          state: {
            contentData: dummyContentData,
            sourceType: 'url',
          },
        });
        setIsLoading(false);
      }, 1500); // Simulate API delay
    } catch (error) {
      console.error('Error analyzing URL:', error);
      toast.error('Failed to analyze URL. Please check the URL and try again.');
      setIsLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your posts or paste URL..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'url' && (
            <div className="space-y-4">
              <p className="text-gray-600">Enter the URL of your social media post:</p>
              <div className="flex gap-4">
                <input
                  type="url"
                  placeholder="https://instagram.com/p/..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  onClick={analyzeUrl}
                  disabled={isLoading || !url}
                  className="btn-primary whitespace-nowrap"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze URL'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <div
                className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload
                    className={`mx-auto h-12 w-12 ${
                      dragActive ? 'text-indigo-500' : 'text-gray-400'
                    }`}
                  />
                  <p className="mt-4 text-gray-600">
                    Drag and drop your files here, or{' '}
                    <button
                      onClick={onButtonClick}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Supports images and videos up to 50MB
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-gray-700">Selected Files:</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => analyzeFiles(files)}
                  disabled={isLoading || files.length === 0}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Files'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
