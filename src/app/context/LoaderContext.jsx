// contexts/LoaderContext.jsx
"use client";
import { createContext, useContext, useState, useCallback } from 'react';
import Typography from "../components/ui/Typography";

const LoaderContext = createContext(null);

function Loader({ text, size }) {
  const sizeClasses = {
    sm: "w-2 h-2 gap-0.5",
    md: "w-4 h-4 gap-1",
    lg: "w-6 h-6 gap-2"
  };

  const textSizes = {
    sm: "h6",
    md: "h4",
    lg: "h3"
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-08/90 backdrop-blur-sm">
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`${sizeClasses[size]} bg-purple-600 animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      {text && (
        <Typography variant={textSizes[size]} className="mt-3">
          {text}
        </Typography>
      )}
    </div>
  );
}

export function LoaderProvider({ children }) {
  const [loaderState, setLoaderState] = useState({
    isVisible: false,
    text: "Loading...",
    size: "md"
  });

  const startLoader = useCallback((options = {}) => {
    setLoaderState({
      isVisible: true,
      text: options.text || "Loading...",
      size: options.size || "md"
    });
  }, []);

  const stopLoader = useCallback(() => {
    setLoaderState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const withLoader = useCallback(async (asyncFunction, options = {}) => {
    try {
      startLoader(options);
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      stopLoader();
    }
  }, [startLoader, stopLoader]);

  return (
    <LoaderContext.Provider value={{ startLoader, stopLoader, withLoader }}>
      {children}
      {loaderState.isVisible && (
        <Loader text={loaderState.text} size={loaderState.size} />
      )}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};

// Use anywhere in your app:
/*
import { useLoader } from './contexts/LoaderContext';

function MyComponent() {
  const { startLoader, stopLoader, withLoader } = useLoader();

  // Method 1: Manual control
  const handleClick = async () => {
    startLoader({ text: "Processing...", size: "lg" });
    await someAsyncOperation();
    stopLoader();
  };

  // Method 2: Auto wrapper
  const handleClick2 = () => {
    withLoader(
      async () => {
        await someAsyncOperation();
      },
      { text: "Loading data...", size: "md" }
    );
  };

  return <button onClick={handleClick}>Do Something</button>;
}
*/