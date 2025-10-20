"use client";
import React, { useState, useEffect } from 'react';
import { Clock, Zap, AlertCircle } from 'lucide-react';
import MultiplayerTopBar from '../ui/MultiplayerTopBar';
import NotFound from '@/not-found';
import useAuth from '@/hooks/useAuth';
import { useSocketContext } from '@/context/SocketProvider';
import { useRouter } from 'next/navigation';
import Loader from '@/loading';
import GameResultsScreen from '../ui/GameResultsScreen';
import { SoundButton } from '../ui/SoundButton';

const MAX_LIMIT_PER_QUIZ_QUE = 30;

export default function MultiplayerQuiz({ quizData, roomId }) {
  const router = useRouter();
  const { user } = useAuth();
  const { roomsState } = useSocketContext();
  const { currentRoom, gameResult, setGameResult, leaveRoom, answerQuestion, roomEvents, finishGame, loading } = roomsState;
  const [gameState, setGameState] = useState('playing'); // 'playing', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(MAX_LIMIT_PER_QUIZ_QUE);
  const [score, setScore] = useState(0);

  // Prepare room data for TopBar
  const roomData = {
    roomId: currentRoom?.id,
    quiz: {
      title: quizData?.title,
      difficulty: quizData?.difficulty,
      totalQuestions: quizData?.questions?.length,
      timeLimit: MAX_LIMIT_PER_QUIZ_QUE * quizData?.questions?.length
    },
    participants: currentRoom?.participants || [],
    participantDetails: currentRoom?.participantDetails || [],
    currentQuestion: currentQuestion,
    startTime: currentRoom?.startTime,
    status: currentRoom?.status
  };

  // Listen for game state changes
  useEffect(() => {
    if (['completed', 'finished'].includes(currentRoom?.status)) {
      setGameState('results');
    }
    
  }, [currentRoom?.status]);

  // reseting when leave page
  useEffect(() => {
    return ()=>{
      setGameResult(null);
    }
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQ = quizData.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ?.correctAnswer;

    // Save answer locally
    setAnswers(prevAnswers => [
      ...prevAnswers,
      {
        question: currentQ?.text,
        selectedAnswer,
        correctAnswer: currentQ?.correctAnswer,
        isCorrect,
        timeUsed: MAX_LIMIT_PER_QUIZ_QUE - timeLeft
      }
    ]);

    // Update score
    if (isCorrect) {
      const points = 10;
      setScore(prevScore => prevScore + points);

      // Send answer to server
      if (answerQuestion) {
        answerQuestion(roomData.roomId, points);
      }
    }

    // Move to next question or finish
    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setSelectedAnswer('');
      setTimeLeft(MAX_LIMIT_PER_QUIZ_QUE);
    } else {
      // Finish game
      if (finishGame) {
        finishGame(roomId, {
          finalScore: score,
          answers: answers
        });
      }
      setGameState('results');
    }
  };

  const handleSurrender = () => {
    if (confirm('Are you sure you want to surrender? This will end the game.')) {
      if (leaveRoom) {
        leaveRoom(roomId);
      }
      router.push('/');
    }
  };

  const handlePlayAgain = () => {
    router.push('/battles');
  };

  const handleExitToLobby = () => {
    router.push('/');
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNextQuestion();
    }
  }, [timeLeft, gameState]);

  if(loading) return <Loader/>;
  if (!quizData) return <NotFound />;
  if (!(currentRoom || gameResult)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-08">
        <div className="bg-gray-15 border border-gray-20 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Room Not Found</h2>
          <p className="text-gray-50 mb-6">You're not connected to a battle room.</p>
          <SoundButton
            onClick={() => router.push('/explore')}
            className="px-6 py-3 bg-purple-60 hover:bg-purple-70 text-white rounded-xl transition-all"
          >
            Return to Home
          </SoundButton>
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
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--gray-08)',
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(112, 59, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(148, 108, 249, 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Top Bar */}
        <MultiplayerTopBar
          roomData={roomData}
          currentUserId={user?.uid}
          roomEvents={roomEvents}
          onSurrender={handleSurrender}
        />

        {/* Question Content */}
        <div className="max-w-4xl mx-auto p-3 sm:p-6 pt-6">
          {/* Progress Bar */}
          <div className="bg-gray-15 border border-gray-20 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-50">Question Progress</span>
              <span className="text-sm font-semibold text-white">
                {currentQuestion + 1}/{quizData.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-60 to-purple-75 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-gray-15 border border-gray-20 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8">
            {/* Timer Badge */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-2xl font-semibold text-white">
                {currentQ?.text}
              </h3>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                  timeLeft <= 5
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400 animate-pulse'
                    : timeLeft <= 10
                    ? 'bg-yellow-400/20 border border-yellow-400/30 text-yellow-400'
                    : 'bg-green-400/20 border border-green-400/30 text-green-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm font-bold">{timeLeft}s</span>
              </div>
            </div>

            {/* Options */}
            <div className="grid gap-3 sm:gap-4 mb-6 sm:mb-8">
              {currentQ?.options.map((option, index) => (
                <SoundButton
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-3 sm:p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'border-purple-60 bg-purple-60/20 text-white scale-[1.02]'
                      : 'border-gray-30 bg-gray-20 hover:border-purple-60/50 hover:bg-gray-30 text-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswer === option
                          ? 'border-purple-60 bg-purple-60'
                          : 'border-gray-40'
                      }`}
                    >
                      {selectedAnswer === option && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="font-medium text-sm sm:text-base">{option}</span>
                  </div>
                </SoundButton>
              ))}
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <SoundButton
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                  selectedAnswer
                    ? 'bg-purple-60 hover:bg-purple-70 text-white shadow-lg shadow-purple-60/30'
                    : 'bg-gray-30 text-gray-50 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {currentQuestion + 1 === quizData.questions.length ? 'Finish Battle' : 'Submit Answer'}
                </span>
              </SoundButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results' && gameResult?.allPlayerResults?.length > 0) {
    return (
      <GameResultsScreen
        gameResult={gameResult}
        currentUserId={user?.uid}
        onPlayAgain={handlePlayAgain}
        onExitToLobby={handleExitToLobby}
      />
    )
  }

  return null;
}