"use client";
import { useState } from 'react';
import { Code, Bug, Zap, CalendarDays } from 'lucide-react';
import HorizontalCardGrid from './components/HorizontalCardGrid';
import SectionHeader from './components/SectionHeader';

const exploreSections = [
  { 
    id: 'quizzes',
    title: "Quiz", 
    description: "Daily coding quizzes to test your skills.",
    icon: Code,
    gradient: "from-purple-60 to-purple-70"
  },
  { 
    id: 'debuggers',
    title: "Debugger", 
    description: "Fix buggy code challenges in real-time.",
    icon: Bug,
    gradient: "from-purple-65 to-purple-75"
  },
  { 
    id: 'problems',
    title: "Problem", 
    description: "Solve algorithmic coding problems.",
    icon: Zap,
    gradient: "from-purple-70 to-purple-75"
  },
];

const routering = { quizzes: 'quiz', debuggers: 'debuggers', problems: 'problem',};

export default function CodingChallengesApp(data) {
  const [dateFilters, setDateFilters] = useState({
    quizzes: { startDate: null, endDate: null, type: 'all' },
    debuggers: { startDate: null, endDate: null, type: 'all' },
    problems: { startDate: null, endDate: null, type: 'all' }
  });
  const [searchFilters, setSearchFilters] = useState({
    quizzes: '',
    debuggers: '',
    problems: ''
  });

  const filterDataByDate = (data, filter, searchText) => {
    if (
      (filter.type === 'all' || (!filter.startDate && !filter.endDate)) &&
      !searchText
    ) {
      return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = filter.startDate ? new Date(filter.startDate) : null;
      const endDate = filter.endDate ? new Date(filter.endDate) : null;

      // Date filtering
      let isWithinDate = true;
      if (startDate && endDate) {
        isWithinDate = itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        isWithinDate = itemDate >= startDate;
      } else if (endDate) {
        isWithinDate = itemDate <= endDate;
      }

      // Search text filtering
      let matchesSearch = true;
      if (searchText) {
        const text = searchText.toLowerCase();
        const title = item.title ? item.title.toLowerCase() : '';
        const description = item.description ? item.description.toLowerCase() : '';
        matchesSearch = title.includes(text) || description.includes(text);
      }

      return isWithinDate && matchesSearch;
    });
  };

  const handleFilterChange = (sectionTitle, newFilter) => {
    setDateFilters(prev => ({
      ...prev,
      [sectionTitle]: newFilter
    }));
  };

  const handleSearchChange = (sectionTitle, text) => {
    setSearchFilters(prev => ({
      ...prev,
      [sectionTitle]: text
    }));
  };


  return (
    <div 
      className="min-h-screen p-6 pt-8"
      style={{ 
        backgroundColor: 'var(--gray-08)',
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(112, 59, 247, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(148, 108, 249, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(130, 84, 248, 0.05) 0%, transparent 50%)
        `
      }}
    >
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-75 to-purple-60 bg-clip-text text-transparent">
            Daily Code Challenges
          </h1>
          <p className="text-xl text-gray-50 max-w-2xl mx-auto">
            Sharpen your coding skills with our curated collection of daily challenges, debugging exercises, and algorithmic problems.
          </p>
        </div>

        {/* Challenge Sections */}
        <div className="space-y-16">
          {exploreSections.map((section, idx) => {
            const allData = data[section.id];
            const filteredData = filterDataByDate(allData, dateFilters[section.id], searchFilters[section.id]);
            
            if (!allData || allData.length === 0) return null;
            
            return (
              <div key={idx} className="w-full relative">
                <SectionHeader 
                  section={section} 
                  index={idx}
                  onFilterChange={(filter) => handleFilterChange(section.id, filter)}
                  onSearchChange={(text) => handleSearchChange(section.id, text)}
                  filteredCount={filteredData.length}
                  totalCount={allData.length}
                />
                {filteredData.length > 0 ? (
                  <HorizontalCardGrid 
                    routering={routering[section.id]} 
                    cards={filteredData} 
                  />
                ) : (
                  <div className="text-center py-12 px-6">
                    <div className="bg-gray-15 border border-gray-20 rounded-2xl p-8 max-w-md mx-auto">
                      <CalendarDays className="w-12 h-12 text-gray-50 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No challenges found</h3>
                      <p className="text-gray-60 text-sm">
                        No {section.title.toLowerCase()} challenges match your date filter. Try adjusting the date range.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}