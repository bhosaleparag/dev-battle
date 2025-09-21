'use client';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QuizCard from "../QuizCard";

const HorizontalCardGrid = ({ routering, cards }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
  }, [cards]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 340; // card width + gap
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mt-6">
      {/* Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-gray-15 to-gray-20 border border-gray-30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide px-16 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card) => (
          <QuizCard
            key={card._id}
            title={card.title}
            routering={routering}
            description={card.description}
            difficulty={card.difficulty}
            daily={card.daily}
            date={card.date}
            quizId={card._id}
          />
        ))}
      </div>

      {/* Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-gray-15 to-gray-20 border border-gray-30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default HorizontalCardGrid;