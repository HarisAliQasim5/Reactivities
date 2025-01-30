import React, { useState } from 'react';
import { Menu, X, Activity } from 'lucide-react';

// Button Props Interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  className?: string;
  children: React.ReactNode;
}

// Custom Button Component
const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-5 h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-gray-800">Reactivities</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="font-semibold"
            >
              Activities
            </Button>
            <a href="/add-activity">
            <Button
              className="font-semibold"
            >
              Create Activity
            </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={toggleMenu}
              className="p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Button
              variant="ghost"
              className="w-full text-left font-semibold"
            >
              Activities
            </Button>
            <Button
              className="w-full font-semibold"
            >
              Create Activity
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;