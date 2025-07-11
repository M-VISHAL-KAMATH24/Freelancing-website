import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const toggleExploreDropdown = () => {
    setIsExploreOpen(!isExploreOpen);
  };

  return (
    <nav className="bg-black bg-opacity-80 backdrop-blur-md fixed top-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                className="h-8 w-auto"
                src="/images/logo1.png" // Replace with your logo path
                alt="Freelance Marketplace"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Explore Dropdown */}
            <div className="relative">
              <button
                onClick={toggleExploreDropdown}
                className="navbar-link"
              >
                Explore
                <svg
                  className="inline-block w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isExploreOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/categories/web-development"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Web Development
                  </Link>
                  <Link
                    to="/categories/graphic-design"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Graphic Design
                  </Link>
                  <Link
                    to="/categories/content-writing"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Content Writing
                  </Link>
                  <Link
                    to="/categories/digital-marketing"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Digital Marketing
                  </Link>
                  <Link
                    to="/categories/video-editing"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Video Editing
                  </Link>
                </div>
              )}
            </div>

            {/* Other Buttons */}
            <Link
              to="/login"
              className="navbar-link"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="navbar-link"
            >
              Signup
            </Link>
            <Link
              to="/seller-signup"
              className="navbar-link"
            >
              Become a Seller
            </Link>
            <Link
              to="/contact"
              className="navbar-link"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;