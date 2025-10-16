"use client";
import { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  RotateCcw, 
  CircleArrowLeft,
  Target,
  Trophy,
  Award
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Button from '../ui/Button';
import Celebration from '../ui/Celebration';
import NotFound from '@/not-found';
import { saveQuizResult } from '@/api/firebase/userProgress';
import { useRouter } from 'next/navigation';
import { SoundButton } from '../ui/SoundButton';
import { useSound } from '@/context/SoundContext';

const MAX_LIMIT_PER_QUIZ_QUE = 30;

export default function SinglePlayerQuiz({ quizData }) {
  const router = useRouter();
  const { user } = useAuth();
  const { play } = useSound();
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(MAX_LIMIT_PER_QUIZ_QUE);
  const [score, setScore] = useState(0);

  if (!quizData) return <NotFound />;

  // Timer effect
  useEffect(() => {
    if(timeLeft <= 5){
      play('timeout')
    }
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNextQuestion();
    } else if (gameState === 'results') {
      saveQuizResult(user?.uid, quizData?._id, score);
    }
  }, [timeLeft, gameState]);

  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setTimeLeft(MAX_LIMIT_PER_QUIZ_QUE);
    setSelectedAnswer('');
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async() => {
    const isCorrect = selectedAnswer === quizData.questions[currentQuestion]?.correctAnswer;
    setAnswers(prevAnswers => [
      ...prevAnswers,
      {
        question: quizData.questions[currentQuestion]?.text,
        selectedAnswer,
        correctAnswer: quizData.questions[currentQuestion]?.correctAnswer,
        isCorrect,
        timeUsed: MAX_LIMIT_PER_QUIZ_QUE - timeLeft
      }
    ]);
    if (isCorrect) {
      play('correct')
      setScore(prevScore => prevScore + (quizData.xp/quizData.questions.length));
    } else {
      play('wrong')
    }

    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setSelectedAnswer('');
      setTimeLeft(MAX_LIMIT_PER_QUIZ_QUE);
    } else {
      setGameState('results');
    }
  };

  const resetQuiz = () => {
    setGameState('start');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setAnswers([]);
    setTimeLeft(MAX_LIMIT_PER_QUIZ_QUE);
    setScore(0);
  };

  // Start Screen
  if (gameState === 'start') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundColor: 'var(--gray-08)',
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(112, 59, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(148, 108, 249, 0.1) 0%, transparent 50%)
          `
        }}
      >
        <div className="bg-gray-15 border border-gray-20 rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-60 to-purple-75 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{quizData.title}</h1>
            <p className="text-gray-50 text-sm sm:text-base leading-relaxed">{quizData.description}</p>
          </div>

          <div className="bg-gray-20 border border-gray-30 rounded-xl p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-60/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-60" />
                </div>
                <div>
                  <p className="text-xs text-gray-50">Time per question</p>
                  <p className="text-white font-semibold">{MAX_LIMIT_PER_QUIZ_QUE}s</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-50">Total questions</p>
                  <p className="text-white font-semibold">{quizData.questions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-50">Total XP</p>
                  <p className="text-white font-semibold">{quizData.xp}</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={startQuiz}
            className="w-full py-3 sm:py-4 flex items-center justify-center gap-3 bg-purple-60 hover:bg-purple-70 text-white font-semibold rounded-xl transition-all"
          >
            <Play className="w-5 h-5" />
            <span>Start Quiz</span>
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  if (gameState === 'playing') {
    const currentQ = quizData.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

    return (
      <div 
        className="min-h-screen p-3 sm:p-6"
        style={{ 
          backgroundColor: 'var(--gray-08)',
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(112, 59, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(148, 108, 249, 0.1) 0%, transparent 50%)
          `
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-15 border border-gray-20 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-60/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-60" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white">
                    Question {currentQuestion + 1} of {quizData.questions.length}
                  </h2>
                  <p className="text-xs text-gray-50">Score: {score}/{quizData.questions.length}</p>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft <= 5 ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 
                timeLeft <= 10 ? 'bg-yellow-400/20 border border-yellow-400/30 text-yellow-400' :
                'bg-green-400/20 border border-green-400/30 text-green-400'
              }`}>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-mono text-base sm:text-lg font-bold">{timeLeft}s</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-60 to-purple-75 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-15 border border-gray-20 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8">
            <h3 className="text-lg sm:text-2xl font-semibold text-white mb-6 sm:mb-8 leading-relaxed">
              {currentQ?.text}
            </h3>

            {/* Options */}
            <div className="grid gap-3 sm:gap-4 mb-6 sm:mb-8">
              {currentQ?.options.map((option, index) => (
                <SoundButton
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-3 sm:p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'border-purple-60 bg-purple-60/20 text-white'
                      : 'border-gray-30 bg-gray-20 hover:border-purple-60/50 hover:bg-gray-30 text-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option
                        ? 'border-purple-60 bg-purple-60'
                        : 'border-gray-40'
                    }`}>
                      {selectedAnswer === option && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium text-sm sm:text-base">{option}</span>
                  </div>
                </SoundButton>
              ))}
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <SoundButton
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedAnswer
                    ? 'bg-purple-60 hover:bg-purple-70 text-white shadow-lg shadow-purple-60/30'
                    : 'bg-gray-30 text-gray-50 cursor-not-allowed'
                }`}
              >
                {currentQuestion + 1 === quizData.questions.length ? 'Finish Quiz' : 'Next Question'}
              </SoundButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const percentage = Math.round((score / quizData.xp) * 100);

    return (
      <div 
        className="min-h-screen p-3 sm:p-6"
        style={{ 
          backgroundColor: 'var(--gray-08)',
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(112, 59, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(148, 108, 249, 0.1) 0%, transparent 50%)
          `
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-gray-15 border border-gray-20 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center mb-4 sm:mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-60 to-purple-75 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
            <div className="text-5xl sm:text-6xl font-bold mb-4">
              <span className={`bg-gradient-to-r ${
                percentage >= 70 ? 'from-green-400 to-emerald-500' : 
                percentage >= 50 ? 'from-yellow-400 to-orange-500' : 
                'from-red-400 to-rose-500'
              } bg-clip-text text-transparent`}>
                {percentage}%
              </span>
            </div>
            <p className="text-base sm:text-xl text-gray-50">
              You scored <span className="font-bold text-white">{score}</span> out of{' '}
              <span className="font-bold text-white">{quizData.xp}</span>
            </p>
          </div>

          {/* Detailed Results */}
          <div className="bg-gray-15 border border-gray-20 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-60" />
              Question Review
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-xl border-l-4 ${
                    answer.isCorrect
                      ? 'border-green-400 bg-green-400/10'
                      : 'border-red-400 bg-red-400/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-white text-sm sm:text-base mb-2">{answer.question}</p>
                      <div className="text-xs sm:text-sm space-y-1">
                        <p>
                          <span className="font-medium text-gray-50">Your answer: </span>
                          <span className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}>
                            {answer.selectedAnswer || 'No answer (time expired)'}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p>
                            <span className="font-medium text-gray-50">Correct answer: </span>
                            <span className="text-green-400">{answer.correctAnswer}</span>
                          </p>
                        )}
                        <p className="text-gray-50">
                          Time used: <span className="text-white">{answer.timeUsed || 1}s</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={resetQuiz}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-20 hover:bg-gray-30 text-white rounded-xl transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Take Quiz Again</span>
            </Button>
            <Button
              onClick={() => router.push('/explore')}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-purple-60 hover:bg-purple-70 text-white rounded-xl transition-all"
            >
              <CircleArrowLeft className="w-5 h-5" />
              <span>Go Back Home</span>
            </Button>
          </div>
        </div>
        <Celebration trigger={percentage >= 70} duration={1500} />
      </div>
    );
  }

  return null;
}