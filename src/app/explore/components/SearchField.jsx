import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';

const SearchField = ({ 
  value = '', 
  onChange, 
  onSearch,
  placeholder = "Search challenges, topics, or keywords...",
  className = "",
  showRecentSearches = true,
  recentSearches = [],
  onClearRecentSearches
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Mock popular searches - you can replace with real data
  const popularSearches = [
    'Maximum Subarray', 'Binary Tree Inorder Traversal', 'String Compression', 
    'Curry Function', 'react js', 'Palindrome Number'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setShowSuggestions(newValue.length === 0 && (recentSearches.length > 0 || popularSearches.length > 0));
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(value.length === 0 && (recentSearches.length > 0 || popularSearches.length > 0));
  };

  const handleSearch = (searchTerm = value) => {
    if (searchTerm.trim()) {
      onSearch?.(searchTerm.trim());
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange?.(suggestion);
    handleSearch(suggestion);
  };

  const clearInput = () => {
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    onClearRecentSearches?.();
  };

  return (
    <div className={`relative w-full max-w-lg ${className}`} ref={containerRef}>
      {/* Search Input */}
      <div className={`
        relative flex items-center bg-gray-10 border rounded-2xl transition-all duration-300
        ${isFocused || showSuggestions
          ? 'border-purple-60 ring-2 ring-purple-60/20 shadow-lg shadow-purple-60/10'
          : 'border-gray-20 hover:border-gray-30'
        }
      `}>
        {/* Search Icon */}
        <div className="flex items-center pl-4">
          <Search className={`w-5 h-5 transition-colors duration-300 ${
            isFocused ? 'text-purple-60' : 'text-gray-50'
          }`} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-50 text-sm font-medium focus:outline-none"
          autoComplete="off"
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={clearInput}
            className="flex items-center pr-2 text-gray-50 hover:text-white transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className="mr-2 px-4 py-2 bg-gradient-to-r from-purple-60 to-purple-70 text-white rounded-xl hover:from-purple-65 hover:to-purple-75 transition-all duration-300 text-sm font-medium shadow-lg"
        >
          Search
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-08 border border-gray-20 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-50" />
                  <span className="text-sm font-medium text-gray-50">Recent Searches</span>
                </div>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-gray-60 hover:text-gray-50 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 4).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-white hover:bg-gray-15 rounded-lg transition-colors duration-200"
                  >
                    <Clock className="w-3 h-3 text-gray-60 flex-shrink-0" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-60" />
              <span className="text-sm font-medium text-gray-50">Popular Searches</span>
            </div>
            <div className="space-y-1">
              {popularSearches.slice(0, 6).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-white hover:bg-gray-15 rounded-lg transition-colors duration-200"
                >
                  <TrendingUp className="w-3 h-3 text-purple-60 flex-shrink-0" />
                  <span className="truncate">{search}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchField;