"use client";

import DateInput from "@/components/ui/DateInput";
import { SoundButton } from "@/components/ui/SoundButton";
import { CalendarDays, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

const DateFilter = ({ onFilterChange, isOpen, onToggle }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');

  const quickFilters = [
    { key: 'all', label: 'All Time', days: null },
    { key: 'today', label: 'Today', days: 0 },
    { key: 'week', label: 'This Week', days: 7 },
    { key: 'month', label: 'This Month', days: 30 },
    { key: 'custom', label: 'Custom Range', days: null }
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleQuickFilter = (filterKey) => {
    setQuickFilter(filterKey);
    const today = new Date();
    
    if (filterKey === 'all') {
      setStartDate('');
      setEndDate('');
      onFilterChange({ startDate: null, endDate: null, type: 'all' });
    } else if (filterKey === 'today') {
      const todayStr = formatDate(today);
      setStartDate(todayStr);
      setEndDate(todayStr);
      onFilterChange({ startDate: todayStr, endDate: todayStr, type: 'today' });
    } else if (filterKey === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const startStr = formatDate(weekAgo);
      const endStr = formatDate(today);
      setStartDate(startStr);
      setEndDate(endStr);
      onFilterChange({ startDate: startStr, endDate: endStr, type: 'week' });
    } else if (filterKey === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);
      const startStr = formatDate(monthAgo);
      const endStr = formatDate(today);
      setStartDate(startStr);
      setEndDate(endStr);
      onFilterChange({ startDate: startStr, endDate: endStr, type: 'month' });
    }
  };

  const handleCustomDateChange = () => {
    if (quickFilter === 'custom') {
      onFilterChange({ 
        startDate: startDate || null, 
        endDate: endDate || null, 
        type: 'custom' 
      });
    }
  };

  useEffect(() => {
    if (quickFilter === 'custom') {
      handleCustomDateChange();
    }
  }, [startDate, endDate]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setQuickFilter('all');
    onFilterChange({ startDate: null, endDate: null, type: 'all' });
  };

  const hasActiveFilter = quickFilter !== 'all' || startDate || endDate;

  return (
    <div>
      {/* Filter Button - Always visible */}
      <SoundButton
        onClick={onToggle}
        className={` h-full
          flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 relative z-10
          ${hasActiveFilter 
            ? 'bg-gradient-to-r from-purple-60 to-purple-70 text-white shadow-lg shadow-purple-60/25' 
            : 'bg-gray-15 border border-gray-20 text-gray-50 hover:border-purple-60/50 hover:text-purple-75'
          }
        `}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          {hasActiveFilter ? quickFilters.find(f => f.key === quickFilter)?.label || 'Filtered' : 'Filter by Date'}
        </span>
      </SoundButton>

      {/* Filter Popup - Tooltip Style */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-gray-10 border border-gray-20 rounded-2xl p-6 shadow-2xl backdrop-blur-sm z-50 
                        before:content-[''] before:absolute before:-top-2 before:right-6 before:w-4 before:h-4 
                        before:bg-gray-10 before:border-l before:border-t before:border-gray-20 before:rotate-45 before:z-[-1]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-60" />
              Filter by Date
            </h3>
            <SoundButton
              onClick={onToggle}
              className="p-2 hover:bg-gray-15 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-50" />
            </SoundButton>
          </div>

          {/* Quick Filters */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-50 mb-3">Quick Filters</label>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <SoundButton
                  key={filter.key}
                  onClick={() => handleQuickFilter(filter.key)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${quickFilter === filter.key
                      ? 'bg-gradient-to-r from-purple-60 to-purple-70 text-white shadow-lg'
                      : 'bg-gray-15 text-gray-50 hover:bg-gray-20 hover:text-purple-75'
                    }
                  `}
                >
                  {filter.label}
                </SoundButton>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          {quickFilter === 'custom' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">Start Date</label>
                <DateInput
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-50 mb-2">End Date</label>
                <DateInput
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Select end date"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {hasActiveFilter && (
              <SoundButton
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-20 text-gray-50 rounded-lg hover:bg-gray-30 transition-colors text-sm font-medium"
              >
                Clear Filters
              </SoundButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;