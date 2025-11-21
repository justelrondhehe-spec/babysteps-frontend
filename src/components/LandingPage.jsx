// src/components/LandingPage.jsx

// NOTICE: We DO NOT import the background image.
// We only import useNavigate from React Router.
import { useNavigate } from 'react-router-dom'; 

export default function LandingPage() {
  
  // We set the background style using a simple text path.
  // This path '/' automatically points to your 'public' folder.
  //
  // ***IMPORTANT***
  // Make sure your file in 'public' is EXACTLY named 'background-pattern.png'
  // If it's named something else (like 'my_bg.png'), change the name here!
  const backgroundStyle = {
    backgroundImage: `url('/background-pattern.png')`, 
  };

  // This gives us the navigate function from the router
  const navigate = useNavigate(); 

  // This function will run when the button is clicked
  const handleStart = () => {
    // It tells the router to go to the "/login" page
    navigate('/login'); 
  };

  return (
    <div
      style={backgroundStyle}
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
    >
      {/* This is the white card */}
      <div className="bg-white p-12 rounded-2xl shadow-xl max-w-lg w-full flex flex-col items-center">
        {/* Logo */}
        <img
          src="/babysteps-logo.png" 
          alt="BabySteps Logo"
          className="w-64 mb-8" 
        />

        {/* Tagline */}
        <p className="text-xl text-gray-700 mb-10">
          Build good habits, one tiny step at a time.
        </p>

        {/* Button */}
        <button 
          onClick={handleStart} 
          className="bg-[#7A8744] text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-[#69753A] transition-colors"
        >
          Let's Start!
        </button>
      </div>
    </div>
  );
}