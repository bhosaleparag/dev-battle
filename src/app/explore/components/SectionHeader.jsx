"use client";
import DateFilter from './DateFilter';
import { useState } from 'react';
import SearchField from './SearchField';


const SectionHeader = ({ section, index, onFilterChange, onSearchChange, filteredCount, totalCount }) => {
  const Icon = section.icon;
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  
  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${section.gradient} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold text-white">
                {section.title}
              </h2>
              {filteredCount !== totalCount && (
                <span className="px-3 py-1 bg-purple-60/20 text-purple-75 rounded-full text-sm font-medium">
                  {filteredCount} of {totalCount}
                </span>
              )}
            </div>
            <p className="text-gray-60 text-base">
              {section.description}
            </p>
          </div>
        </div>
        <div className='flex gap-2 h-[50px] w-[50vw] justify-end'>
          <SearchField
            value={searchValue}
            onChange={setSearchValue}
            onSearch={(term) => {
              onSearchChange(term)
              setRecentSearches(prev => [term, ...prev.filter(s => s !== term)].slice(0, 10));
            }}
            recentSearches={recentSearches}
            onClearRecentSearches={() => setRecentSearches([])}
            placeholder="Search challenges, topics, or keywords..."
            showRecentSearches={true}
          />

          <DateFilter
            onFilterChange={onFilterChange}
            isOpen={showDateFilter}
            onToggle={() => setShowDateFilter(!showDateFilter)}
          />
        </div>
      </div>
      
      {/* Decorative line */}
      <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-purple-60 to-purple-70 rounded-full" />
    </div>
  );
};

export default SectionHeader;