import React, { useState } from 'react';
import { Wind, LogOut, LogIn, UserPlus } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wind size={32} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">Surf Session Assistant</h1>
        </div>
        <div className="flex items-center space-x-4">
          {!isLoggedIn && (
            <>
              <button
                onClick={() => setShowRegister(true)}
                className="btn btn-primary flex items-center"
              >
                <UserPlus size={20} className="mr-2" />
                Sign Up
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="btn btn-secondary flex items-center"
              >
                <LogIn size={20} className="mr-2" />
                Login
              </button>
            </>
          )}
          {isLoggedIn && (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="btn btn-primary flex items-center"
            >
              <LogOut size={20} className="mr-2" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <LoginForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <RegisterForm onClose={() => setShowRegister(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;