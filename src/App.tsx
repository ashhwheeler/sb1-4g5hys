import React, { useState } from 'react';
import Header from './components/Header';
import ForecastForm from './components/ForecastForm';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoggedIn ? (
          <Dashboard />
        ) : (
          <>
            <ForecastForm />
          </>
        )}
      </main>
      <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>&copy; 2024 Surf Session Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;