"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Play, Send, Clock, Terminal, TestTube2, GripVertical, BookOpen, FileInput, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useSocketContext } from '@/context/SocketProvider';
import { useRouter } from 'next/navigation';
import GameResultsScreen from '@/components/ui/GameResultsScreen';
import MultiplayerTopBar from '@/components/ui/MultiplayerTopBar';
import Loader from '@/loading';
import NotFound from '@/not-found';
import useAuth from '@/hooks/useAuth';
import { parseMultipleInputs } from '@/utils/parseInput';
import { calculateXP } from '@/utils/calculateXP';
import { codeEditorTabs } from '@/lib/constants';
import { SoundButton } from '@/components/ui/SoundButton';
import { useSound } from '@/context/SoundContext';

export default function MultiplayerCodeEditor({ data, roomId }) {
  const router = useRouter();
  const { user } = useAuth();
  const { play } = useSound();
  const { roomsState } = useSocketContext();
  const { currentRoom, gameResult, setGameResult, leaveRoom, solveTestCase, finishGame, roomEvents, loading } = roomsState;
  
  const [code, setCode] = useState(data?.starterCode || `function solution(arr) {
    // Write your code here
  }`);
  const [inputs, setInputs] = useState(data?.testCases[0].input);
  const [output, setOutput] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'results'
  
  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Prepare room data for TopBar
  const roomData = {
    roomId: currentRoom?.id,
    challenge: {
      title: data?.title,
      difficulty: data?.difficulty,
      timeLimit: data?.timeLimit,
      isTimeLimit: true
    },
    participants: currentRoom?.participants || [],
    participantDetails: currentRoom?.participantDetails || [],
    startTime: currentRoom?.startTime,
    status: currentRoom?.status
  };

  const handleSurrender = () => {
    if (confirm('Are you sure you want to surrender? This will end the game.')) {
      router.push('/battles');
    }
  };

  const handlePlayAgain = () => {
    router.push('/battles');
  };

  const handleExitToLobby = () => {
    router.push('/');
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTimeUp = async () => {
    await handleSubmit(true); // auto-submit flag
  };

  const onChange = (value) => {
    setCode(value);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput({success: true, message: 'Running code...'});
    setActiveTab('output');
    let tempInputs = parseMultipleInputs(inputs);
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: code,
          inputs: [tempInputs]
        })
      });

      if (!res.ok) {
        toast.error("Failed to send code");
      }

      const outputText = await res.json();
      if(outputText?.error){
        let tempOutput = outputText?.error
        if (outputText?.error.toLowerCase().includes('execution error')){
          tempOutput = 'Code execution failed. Please check your code for errors and try again.'
        }
        setOutput({success: false, message: tempOutput});
      } else if(Array.isArray(outputText) && outputText.length > 0 && outputText[0].output) {
        setOutput({success: true, message: JSON.stringify(outputText[0].output)});
      }
    } catch (error) {
      setOutput({success: false, message: error.message});
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    let prevPassedCases = testResults?.filter(r => r.passed).length
    setIsSubmitting(true);
    setActiveTab('results');
    setTestResults([]);

    const allInputs = data.testCases.map(tc => {
      try {
        return Array.isArray(tc.input) ? parseMultipleInputs(tc.input) : [parseInput(tc.input)];
      } catch {
        return Array.isArray(tc.input) ? tc.input : [tc.input];
      }
    });

    const createResult = (index, testCase, actual, passed, status) => ({
      testCase: index + 1,
      input: testCase.input,
      expected: testCase.output,
      actual,
      passed,
      status: { description: status }
    });

    let allResults = [];

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, inputs: allInputs })
      });
      
      if (!res.ok) toast.error(`API request failed with status ${res.status}`);
      
      const apiResponse = await res.json();

      allResults = data.testCases.map((tc, i) => {
        if (apiResponse?.error) {
          return createResult(i, tc, `Error: ${apiResponse.error}`, false, 'Runtime Error');
        }
        
        const resultData = apiResponse?.[i];
        if (!resultData) {
          return createResult(i, tc, 'No response received', false, 'Error');
        }
        if (resultData.error) {
          return createResult(i, tc, `Error: ${resultData.error}`, false, 'Runtime Error');
        }
        
        const actual = resultData.output;
        let passed;
        try {
          const expected = JSON.parse(tc.output);
          passed = JSON.stringify(actual) === JSON.stringify(expected);
        } catch {
          passed = actual.toString() === tc.output.toString();
        }
        
        return createResult(i, tc, JSON.stringify(actual), passed, passed ? 'Accepted' : 'Wrong Answer');
      });

      const passedCases = allResults.filter(r => r.passed).length;
      const completed = passedCases === data.testCases.length;
      const totalScore = calculateXP(passedCases, data.testCases.length, data.xp);

      if (isAutoSubmit || (passedCases > prevPassedCases)) {
        await new Promise((resolve) => {
          solveTestCase(roomId, totalScore)
          // Small delay to ensure Redis updates
          setTimeout(resolve, 300);
        });
      }
      if (isAutoSubmit || completed) {
        if (finishGame) {
          await finishGame(roomId, {
            finalScore: totalScore,
            completed: completed
          });
        }
        setGameState('results');
      }

    } catch (error) {
      allResults = data.testCases.map((tc, i) => 
        createResult(i, tc, `Execution Error: ${error.message}`, false, 'Error')
      );
    } finally {
      setTestResults(allResults);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth >= 30 && newWidth <= 70) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Listen for game state changes
  useEffect(() => {
    if (['completed', 'finished'].includes(currentRoom?.status)) {
      setGameState('results');
    }
  }, [currentRoom?.status]);

  // Listen for game state changes
  useEffect(() => {
    play('start')
    return () => {
      leaveRoom(roomId);
      setGameResult(null);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }
  
  // Results Screen
  if (gameResult?.allPlayerResults?.length > 0) {
    return (
      <GameResultsScreen
        gameResult={gameResult}
        currentUserId={user?.uid}
        onPlayAgain={handlePlayAgain}
        onExitToLobby={handleExitToLobby}
      />
    );
  }

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  const getStatusIcon = (result) => {
    if (result.passed) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  // Check if room exists
  if (!data) return <NotFound />;
  
  if (!(currentRoom || gameResult)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-08">
        <div className="bg-gray-15 border border-gray-20 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Room Not Found</h2>
          <p className="text-gray-50 mb-6">You're not connected to a battle room.</p>
          <SoundButton
            onClick={() => router.push('/battles')}
            className="px-6 py-3 bg-purple-60 hover:bg-purple-70 text-white rounded-xl transition-all"
          >
            Return to Battles
          </SoundButton>
        </div>
      </div>
    );
  }

  // Playing Screen
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
        gameState={gameState}
        onTimeUp={handleTimeUp}
        onSurrender={handleSurrender}
      />

      <div 
        ref={containerRef}
        className="flex h-[91vh] overflow-hidden"
        style={{ userSelect: isDragging ? 'none' : 'auto' }}
      >
        {/* Left Panel - Code Editor */}
        <div 
          className="flex flex-col"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="bg-gray-10 border-b border-gray-15 mb-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-15">
              <div>
                <h2 className="text-lg font-semibold text-white">Code Editor</h2>
                <p className="text-sm text-gray-60 mt-1">Write your solution below</p>
              </div>
              
              <div className="flex items-center gap-3">
                <SoundButton
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2 bg-purple-60 hover:bg-purple-65 disabled:bg-gray-30 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  {isRunning ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Code
                    </>
                  )}
                </SoundButton>
                
                <SoundButton
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-30 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </SoundButton>
              </div>
            </div>
            
            <div className="p-0 bg-gray-15">
              <CodeMirror
                value={code}
                height="100vh"
                theme={vscodeDark}
                extensions={[
                  javascript({ jsx: true }),
                  EditorView.domEventHandlers({
                    paste: (event) => {
                      event.preventDefault();
                      return true;
                    }
                  })
                ]}
                onChange={onChange}
                className="text-md"
              />
            </div>
          </div>
        </div>

        {/* Drag Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-2 bg-gray-15 hover:bg-purple-60 cursor-col-resize transition-colors relative group ${
            isDragging ? 'bg-purple-60' : ''
          }`}
        >
          <div className="absolute top-1/2 -left-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-white-90" />
          </div>
        </div>

        {/* Right Panel - Tabs */}
        <div 
          className="flex flex-col bg-gray-10 ml-0 border border-gray-15 overflow-hidden"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-15 bg-gray-08">
            {codeEditorTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <SoundButton
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-purple-60 bg-gray-10'
                      : 'text-gray-60 hover:text-white-90 hover:bg-gray-15'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-60" />
                  )}
                </SoundButton>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Problem Tab */}
            {activeTab === 'problem' && (
              <div className="space-y-4 text-white-90">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{data.title}</h3>
                  <p className="leading-relaxed">{data.description}</p>
                </div>

                {data.testCases[0] && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Example:</h4>
                    <div className="bg-gray-08 border border-gray-15 rounded-lg p-3">
                      <pre className="text-sm text-white-90">
                        <span className="text-purple-60">Input:</span> {data.testCases[0].input.join(', ')}
                        {'\n'}
                        <span className="text-emerald-400">Output:</span> {data.testCases[0].output}
                      </pre>
                    </div>
                  </div>
                )}

                {data.constraints?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Constraints:</h4>
                    <ul className="space-y-1">
                      {data.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-sm text-white-90 pl-2">
                          <span className="text-purple-60 font-medium">{idx + 1}.</span> {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.tags?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-60/20 text-purple-60 border border-purple-60/30 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.hints?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Hints:</h4>
                    <div className="space-y-2">
                      {data.hints.map((hint, idx) => (
                        <div key={idx} className="bg-gray-08 border border-gray-15 rounded-lg p-3">
                          <p className="text-sm text-white-90">{hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inputs Tab */}
            {activeTab === 'inputs' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Test Inputs</h3>
                  <p className="text-sm text-gray-60 mb-4">Modify inputs to test your code</p>
                </div>
                {inputs.map((input, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-white-90 mb-2">
                      Input {index + 1}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-08 border border-gray-15 text-white placeholder:text-gray-40 focus:border-purple-60 focus:ring-2 focus:ring-purple-60/20 rounded-lg px-3 py-2 outline-none transition-all"
                      placeholder={`Enter input ${index + 1}`}
                      value={input || ''}
                      onChange={(e) => {
                        const newInputs = [...inputs];
                        newInputs[index] = e.target.value;
                        setInputs(newInputs);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Test Results</h3>
                  {testResults.length > 0 && (
                    <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                      passedTests === totalTests 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {passedTests}/{totalTests} passed
                    </span>
                  )}
                </div>

                {testResults.length === 0 && !isSubmitting && (
                  <div className="text-center py-12 text-gray-60">
                    <TestTube2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No test results yet. Click Submit to run tests.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${
                        result.passed 
                          ? 'border-emerald-500/30 bg-emerald-500/5' 
                          : 'border-red-500/30 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result)}
                          <span className="font-medium text-white text-sm">Test {result.testCase}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.passed 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {result.status?.description}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-purple-60 font-medium">Input:</span>
                          <div className="bg-gray-15 px-2 py-1 rounded text-white-90 mt-1">
                            {Array.isArray(result.input) ? result.input.join(', ') : result.input}
                          </div>
                        </div>
                        <div>
                          <span className={`font-medium ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            Output:
                          </span>
                          <div className="bg-gray-15 px-2 py-1 rounded text-white-90 mt-1">
                            {result.actual}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isSubmitting && testResults.length < data.testCases.length && (
                    <div className="border border-gray-30 rounded-lg p-4 bg-gray-15/30">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                        <span className="text-white-90 text-sm">Running test {testResults.length + 1}...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'output' && (
              <div className="space-y-4">
                {output ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Output</h3>
                    </div>
                    <div className="bg-gray-08 border border-gray-15 rounded-lg p-4">
                      <pre className={`text-sm whitespace-pre-wrap font-mono max-h-96 overflow-y-auto ${
                        output?.success ? 'text-white-90' : 'text-red-400'
                      }`}>
                        {output?.message}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-60">
                    <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No output yet. Click Run Code to see results.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}