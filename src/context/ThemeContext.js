import React, { createContext, useState, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const toggleTheme = (value) => {
    const newTheme = value;
    setIsDarkTheme(newTheme);
    storage.set('darkTheme', newTheme);
  };

  useEffect(() => {
    const savedTheme = storage.getBoolean('darkTheme') === undefined ? true : storage.getBoolean('darkTheme');
    if(savedTheme === undefined) {
      storage.set('darkTheme', true);
    }
    if (savedTheme !== null) {
      setIsDarkTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
