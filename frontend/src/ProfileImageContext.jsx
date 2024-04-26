// Create a new context file: ProfileImageContext.js
import { createContext, useContext, useState } from 'react';

// Create a Context for the profile image
const ProfileImageContext = createContext();

// Provider in your app where you fetch the profile image
export const ProfileImageProvider = ({ children }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // Provide the profile image URL and the setter function to the context
  return (
    <ProfileImageContext.Provider value={{ profileImageUrl, setProfileImageUrl }}>
      {children}
    </ProfileImageContext.Provider>
  );
};

// Custom hook to use the profile image context
export const useProfileImage = () => useContext(ProfileImageContext);
