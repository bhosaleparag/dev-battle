'use client';
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useState, Fragment } from "react";
import QuizCard from "../QuizCard";
import { SoundButton } from "@/components/ui/SoundButton";


// Vertical Grid with Pagination Component
const VerticalCardGrid = ({ routering, cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cards.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-6">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {currentItems.map((card) => (
          <QuizCard
            key={card._id}
            title={card.title}
            routering={routering}
            description={card.description}
            difficulty={card.difficulty}
            daily={card.daily}
            date={card.date}
            quizId={card._id}
            xp={card.xp}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-50">Show:</span>
            <div className="flex gap-2">
              {[6, 12, 24].map((value) => (
                <SoundButton
                  key={value}
                  onClick={() => handleItemsPerPageChange(value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    itemsPerPage === value
                      ? 'bg-purple-60 text-white'
                      : 'bg-gray-20 text-gray-50 hover:bg-gray-30'
                  }`}
                >
                  {value}
                </SoundButton>
              ))}
            </div>
          </div>

          {/* Page Info */}
          <div className="text-sm text-gray-50">
            Showing <span className="font-semibold text-white">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-white">{Math.min(endIndex, cards.length)}</span> of{' '}
            <span className="font-semibold text-white">{cards.length}</span> challenges
          </div>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <SoundButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-20 text-gray-50 hover:bg-purple-60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-20 disabled:hover:text-gray-50 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </SoundButton>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => (
                <Fragment key={idx}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-50">...</span>
                  ) : (
                    <SoundButton
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-purple-60 text-white shadow-lg shadow-purple-60/30'
                          : 'bg-gray-20 text-gray-50 hover:bg-gray-30 hover:text-white'
                      }`}
                    >
                      {page}
                    </SoundButton>
                  )}
                </Fragment>
              ))}
            </div>

            {/* Next Button */}
            <SoundButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-20 text-gray-50 hover:bg-purple-60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-20 disabled:hover:text-gray-50 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </SoundButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalCardGrid;