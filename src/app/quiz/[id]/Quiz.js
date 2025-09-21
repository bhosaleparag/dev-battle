"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Play, CheckCircle, XCircle, CircleArrowLeft, RotateCcw } from 'lucide-react';
import NotFound from '@/not-found';
import { MAX_LIMIT_PER_QUIZ_QUE } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Celebration from '@/components/ui/Celebration';
import { saveQuizResult } from '@/api/firebase/userProgress';

export default function QuizApp({ quizData }) {
  const router = useRouter();
  const { user } = useAuth();
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(MAX_LIMIT_PER_QUIZ_QUE);
  const [score, setScore] = useState(0);

  // if there no data then show not found page
  if(!quizData) return (
    <NotFound/>
  )
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNextQuestion();
    } else if(gameState === 'results') {
      saveQuizResult(user?.uid, quizData?._id, score)
    }
  }, [timeLeft, gameState, saveQuizResult, quizData?._id, user?.uid, ]);

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

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === quizData.questions[currentQuestion]?.correctAnswer;
    setAnswers(prevAnswers=>[...prevAnswers, {
      question: quizData.questions[currentQuestion]?.text,
      selectedAnswer,
      correctAnswer: quizData.questions[currentQuestion]?.correctAnswer,
      isCorrect,
      timeUsed: MAX_LIMIT_PER_QUIZ_QUE - timeLeft
    }]);
    if (isCorrect) setScore(prevScore=>prevScore + 1);

    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(prevQuestion=> prevQuestion + 1);
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
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="border border-gray-30 rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="mb-6">
            <Typography variant='h1' className="mb-4">{quizData.title}</Typography>
            <Typography className="text-gray-40 leading-relaxed">{quizData.description}</Typography>
          </div>
          
          <div className="bg-white-90 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>{MAX_LIMIT_PER_QUIZ_QUE} seconds per question</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>{quizData.questions.length} questions</span>
              </div>
            </div>
          </div>

          <Button
            onClick={startQuiz}
            className="px-8 py-4 flex items-center space-x-3 mx-auto"
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
      <div className="min-h-full p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-15 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white-99">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </h2>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                timeLeft <= 5 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{timeLeft}s</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-30 rounded-full h-2">
              <div 
                className="bg-purple-60 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-15 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-white-99 mb-8 leading-relaxed">
              {currentQ?.text}
            </h3>

            {/* Options */}
            <div className="grid gap-4 mb-8">
              {currentQ?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? 'border-purple-60 bg-purple-70 text-white-99'
                      : 'border-gray-30 hover:border-gray-40 hover:bg-gray-20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswer === option
                        ? 'border-purple-60 bg-purple-60'
                        : 'border-gray-40'
                    }`}>
                      {selectedAnswer === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  selectedAnswer
                    ? 'bg-purple-60 hover:bg-purple-70 text-white'
                    : 'bg-gray-30 text-gray-50 cursor-not-allowed'
                }`}
              >
                {currentQuestion + 1 === quizData.questions.length ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const percentage = Math.round((score / quizData.questions.length) * 100);
    
    return (
      <div className="min-h-full">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-gray-15 rounded-lg shadow-lg p-5 text-center my-4">
            <h2 className="text-3xl font-bold text-white-99 mb-4">Quiz Complete!</h2>
            <div className="text-6xl font-bold mb-4">
              <span className={percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                {percentage}%
              </span>
            </div>
            <p className="text-xl text-gray-60">
              You scored {score} out of {quizData.questions.length} questions correctly
            </p>
          </div>

          {/* Detailed Results */}
          <div className="bg-gray-15 rounded-lg shadow-lg p-4 mb-4">
            <h3 className="text-xl font-semibold text-white-99 mb-4">Question Review</h3>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  answer.isCorrect ? 'border-green-500 bg-green-200' : 'border-red-500 bg-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    {answer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800 mb-2">{answer.question}</p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium text-gray-50">Your answer:</span>
                          <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {' '}{answer.selectedAnswer || 'No answer (time expired)'}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p>
                            <span className="font-medium text-gray-50">Correct answer:</span>
                            <span className="text-green-700"> {answer.correctAnswer}</span>
                          </p>
                        )}
                        <p className="text-gray-50">Time used: <span className="text-gray-08">{answer.timeUsed || 1}s</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-row gap-10 justify-center mb-6'>
            <div className="text-center">
              <Button
                onClick={resetQuiz}
                className="font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Take Quiz Again</span>
              </Button>
            </div>
            <div className="text-center">
              <Button
                onClick={()=>router.push('/explore')}
                className="font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 mx-auto cursor-pointer"
              >
                <CircleArrowLeft className="w-5 h-5" />
                <span>Go Back Home</span>
              </Button>
            </div>
          </div>
        </div>
        <Celebration trigger={percentage>=70} duration={1500} />
      </div>
    );
  }
}