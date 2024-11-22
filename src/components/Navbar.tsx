import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">PostToAmazon</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 transition">Features</a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600 transition">About</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition">Contact</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
              Sign In
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Sign Up
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Features</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">About</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Contact</a>
            <div className="border-t border-gray-200 pt-2">
              <button className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md">Sign In</button>
              <button className="block w-full px-3 py-2 text-left text-white bg-indigo-600 hover:bg-indigo-700 rounded-md mt-2">Sign Up</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}