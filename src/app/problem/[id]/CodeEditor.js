"use client";
import { useState, useRef, useEffect } from 'react';
import { Play, Send, CheckCircle, XCircle, Clock, FileText, Layers, TestTube2, GripVertical, Terminal } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import useAuth from '@/hooks/useAuth';
import { saveProblemResult } from '@/api/firebase/userProgress';
import parseInput, { parseMultipleInputs } from '@/utils/parseInput';
import { toast } from 'sonner';
import { calculateXP } from '@/utils/calculateXP';
import { SoundButton } from '@/components/ui/SoundButton';

export default function CodeEditor({ data }) {
  const { user } = useAuth();
  const [code, setCode] = useState(data?.starterCode || `function solution(arr) {
    // Write your code here
  }`);
  const [inputs, setInputs] = useState(data.testCases[0].input);
  const [output, setOutput] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  
  // Resizable panel state
  const [leftWidth, setLeftWidth] = useState(60); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Load saved layout
  useEffect(() => {
    const savedWidth = localStorage.getItem('editorLeftWidth');
    if (savedWidth) {
      setLeftWidth(parseFloat(savedWidth));
    }
  }, []);

  // Handle resize drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 30% and 70%
    if (newLeftWidth >= 30 && newLeftWidth <= 70) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('editorLeftWidth', leftWidth.toString());
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, leftWidth]);

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
        if (outputText?.error.includes('Execution error:')){
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveTab('results');
    setTestResults([]);

    const allResults = [];
    const allInputs = data.testCases.map(testCase => {
      try {
        
        // Parse each input and handle both single values and arrays
        if(Array.isArray(testCase.input)){
          return parseMultipleInputs(testCase.input)
        } else {
          return [parseInput(testCase.input)];
        } 
      } catch (error) {
        // If parsing fails, return the original input as string
        return Array.isArray(testCase.input) ? testCase.input : [testCase.input];
      }
    });

    try {
      // Send the code and all inputs at once
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: code,
          inputs: allInputs // Send all inputs as 2D array
        })
      });
      
      if (!res.ok) {
        toast.error(`API request failed with status ${res.status}`);
      }
      
      const apiResponse = await res.json();

      // 3. Process each test case result
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
      let passedCases = allResults.filter(r => r.passed).length
      let completed = passedCases === data.testCases.length
      let tempXP = calculateXP(passedCases, data.testCases.length, data.xp)
      await saveProblemResult(user.uid, data._id, completed, tempXP)

    } catch (error) {
      // Handle network errors or other exceptions
      allResults = data.testCases.map((tc, i) => 
        createResult(i, tc, `Execution Error: ${error.message}`, false, 'Error')
      );
    }
    
    setTestResults(allResults);
    setIsSubmitting(false);
  };

  const getStatusIcon = (result) => {
    return result.passed ? (
      <CheckCircle className="w-4 h-4 text-emerald-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  const onChange = (value, viewUpdate) => {
    setCode(value);
  }

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  const tabs = [
    { id: 'problem', label: 'Problem', icon: FileText },
    { id: 'inputs', label: 'Test Inputs', icon: Layers },
    { id: 'output', label: 'Output', icon: Terminal },
    { id: 'results', label: 'Results', icon: TestTube2 },
  ];

  return (
    <div className="min-h-[91vh] bg-gray-08 text-white">
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
                  onClick={handleSubmit}
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
                extensions={[javascript({ jsx: true })]}
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
            {tabs.map((tab) => {
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