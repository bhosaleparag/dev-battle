"use client";
import React, { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const DateInput = ({ value, onChange, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    if (value !== selectedDate) {
      setSelectedDate(value || '');
      if (value) {
        setCurrentMonth(new Date(value));
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    onChange(dateString);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  const clearDate = () => {
    setSelectedDate('');
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 bg-gray-10 border border-gray-20 rounded-xl
          text-white text-sm font-medium cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-purple-60/50 focus:border-purple-60
          transition-all duration-300 hover:border-gray-30
          ${isOpen ? 'ring-2 ring-purple-60/50 border-purple-60' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={selectedDate ? 'text-white' : 'text-gray-50'}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
          <CalendarDays className="w-4 h-4 text-gray-50" />
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-08 border border-gray-20 rounded-2xl shadow-2xl z-[50] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-10 border-b border-gray-20">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-15 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            
            <h3 className="text-white font-semibold">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-15 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-50 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index} className="aspect-square">
                  {date ? (
                    <button
                      onClick={() => handleDateSelect(date)}
                      className={`
                        w-full h-full flex items-center justify-center rounded-lg text-sm font-medium
                        transition-all duration-200 hover:bg-gray-15
                        ${isSelected(date) 
                          ? 'bg-gradient-to-r from-purple-60 to-purple-70 text-white shadow-lg' 
                          : isToday(date)
                          ? 'bg-purple-60/20 text-purple-75 border border-purple-60/30'
                          : 'text-white hover:text-purple-75'
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4 bg-gray-10 border-t border-gray-20">
            <button
              onClick={clearDate}
              className="text-sm font-medium text-gray-50 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-purple-60 hover:bg-purple-70 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;