import DifficultyChip from '@/explore/components/DifficultyChip';
import { ArrowRight, Calendar, Clock, Trophy, Zap, } from 'lucide-react';
import Link from 'next/link';

/**
 * A card component to display a single quiz.
 * It is a clickable link that directs users to the quiz page.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the quiz.
 * @param {string} props.description - A brief description of the quiz.
 * @param {string} props.quizId - The unique ID of the quiz, used for the link.
 */

const QuizCard = ({ routering, title, description, quizId, difficulty, daily, date, xpReward = 50 }) => {
  const isToday = date === '2024-01-15'; // Mock today's date

  return (
    <Link 
      href={`/${routering}/${quizId}`} 
      className="group relative bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-60/30 min-w-[350px] max-w-[350px] max-h-[220px] cursor-pointer overflow-hidden"
      style={{ transform: 'translateZ(0)' }} // Force hardware acceleration without creating stacking context issues
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 flex flex-col h-full group-hover:scale-[1.02] transition-transform duration-300">
        {/* Header with title and XP indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-75 transition-colors duration-300 leading-tight">
              {title}
            </h3>
            {isToday && (
              <div className="flex items-center gap-1 text-purple-75 text-xs font-medium">
                <Clock className="w-3 h-3" />
                Today's Challenge
              </div>
            )}
          </div>
          
          {/* XP Reward - Top Right Corner */}
          <div className="flex items-center gap-1 text-purple-75 bg-purple-60/10 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            <span className="text-xs font-medium">+{xpReward} XP</span>
          </div>
        </div>

        <p className="text-gray-60 text-sm leading-relaxed mb-4 flex-1 text-ellipsis overflow-hidden">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-15">
          <div className="flex items-center gap-3">
            {difficulty && <DifficultyChip level={difficulty} />}
            {!difficulty && (
              <div className="flex items-center gap-1 text-purple-75">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-medium">Knowledge Test</span>
              </div>
            )}
          </div>
          <ArrowRight className="w-5 h-5 text-gray-50 group-hover:text-purple-60 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;

