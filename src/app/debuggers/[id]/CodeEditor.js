"use client";
import React, { useEffect, useState } from 'react';
import { Play, Send, CheckCircle, XCircle, Clock, RotateCcw, CircleArrowLeft } from 'lucide-react';
import Typography from '../../components/ui/Typography';
import Chip from '@/components/ui/Chip';
import Input from '@/components/ui/Input';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useRouter } from 'next/navigation';
import { debuggerMessages, MAX_LIMIT_DEBUGGER } from '@/lib/constants';
import Modal from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Celebration from '@/components/ui/Celebration';
import { saveDebuggerResult } from '@/api/firebase/userProgress';
import useAuth from '@/hooks/useAuth';

export default function CodeEditor ({ data, match='solo' }){
  const { user } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState({dialog: false, title: '', message: '', success: false});
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState({success: true, message: ''});
  const [inputs, setInputs] = useState(data?.testCases?.[0]?.input || []);
  const [code, setCode] = useState(data?.buggyCode || `function solution(arr) {
  // Write your code here
}`);

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  const onChange = (value, viewUpdate) => {
    setCode(value);
  }

  const onResultModalClose = () => {
    router.push("/explore")
  }

  const handleRun = async () => {
    setIsRunning(true);
    setOutput({success: true, message: 'Running code...'});
    setShowTests(false);
    let tempInputs = inputs.map(ipt => {
      try {
        return JSON.parse(ipt);
      } catch {
        return eval("(" + ipt + ")");
      }
    });

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
        throw new Error("Failed to send code");
      }

      const outputText = await res.json();
      if(outputText?.error){
        setOutput({success: false, message: outputText?.error});
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
    setShowTests(true);
    setTestResults([]);

    const allResults = [];
    const allInputs = data.testCases.map(testCase => {
      try {
        // Parse each input and handle both single values and arrays
        return Array.isArray(testCase.input) 
          ? testCase.input.map(ipt => JSON.parse(ipt))
          : [JSON.parse(testCase.input)];
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
        throw new Error(`API request failed with status ${res.status}`);
      }
      
      const apiResponse = await res.json();

      // 3. Process each test case result
      data.testCases.forEach((testCase, index) => {
        let result;
        
        if (apiResponse && apiResponse.error) {
          // Handle global API error
          result = {
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: `Error: ${apiResponse.error}`,
            passed: false,
            status: { description: 'Runtime Error' }
          };
        } else if (apiResponse && index < apiResponse.length) {
          const resultData = apiResponse[index];
          
          if (resultData && resultData.error) {
            // Handle individual test case runtime error
            result = {
              testCase: index + 1,
              input: testCase.input,
              expected: testCase.expectedOutput,
              actual: `Error: ${resultData.error}`,
              passed: false,
              status: { description: 'Runtime Error' }
            };
          } else if (resultData) {
            // Handle successful execution
            const actualOutput = resultData.output;
            
            // Compare expected vs. actual output
            let passed;
            try {
              // Try to parse expected output for comparison
              const expectedOutput = JSON.parse(testCase.expectedOutput);
              passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
            } catch {
              // Fallback to string comparison if parsing fails
              passed = actualOutput.toString() === testCase.expectedOutput.toString();
            }
            
            result = {
              testCase: index + 1,
              input: testCase.input,
              expected: testCase.expectedOutput,
              actual: JSON.stringify(actualOutput),
              passed,
              status: passed ? { description: 'Accepted' } : { description: 'Wrong Answer' }
            };
          } else {
            result = {
              testCase: index + 1,
              input: testCase.input,
              expected: testCase.expectedOutput,
              actual: 'No response data',
              passed: false,
              status: { description: 'Error' }
            };
          }
        } else {
          // Handle missing response data
          result = {
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: 'No response received',
            passed: false,
            status: { description: 'Error' }
          };
        }
        
        allResults.push(result);
      });

    } catch (error) {
      // Handle network errors or other exceptions
      data.testCases.forEach((testCase, index) => {
        const errorResult = {
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: `Execution Error: ${error.message}`,
          passed: false,
          status: { description: 'Error' }
        };
        allResults.push(errorResult);
      });
    }
    let perfectScore = allResults.filter(r => r.passed).length === data.testCases.length
    await saveDebuggerResult(user.uid, data._id, perfectScore)
    if(perfectScore){
      setResult({dialog: true, success: true, ...debuggerMessages.success });
      setTimeout(() => onResultModalClose(), 8000);
    }
    setTestResults(allResults);
    setIsSubmitting(false);
  };

  const getStatusIcon = (result) => {
    if (result.passed) {
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  // NOTE later replace with actual backend 
  useEffect(() => {
    if (match !== "solo") return;

    const interval = setTimeout(() => {
      clearInterval(interval);
      if(!result?.success){
        setResult({ dialog: true, success: false, ...debuggerMessages.failure.closeToFix });
        setTimeout(() => router.push("/explore"), 3000);
      }
    }, MAX_LIMIT_DEBUGGER);

    return () => clearInterval(interval);
  }, [match]);
  
  return (
    <div className="min-h-screen">
      <div className="py-6 px-2">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Code Editor */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-15">
                <div>
                  <h2 className="text-lg font-semibold text-white">Code Editor</h2>
                  <p className="text-sm text-gray-60 mt-1">Write your solution below</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
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
                  </button>
                  
                  <button
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
                  </button>
                </div>
              </div>
              
              <div className="p-0">
                <CodeMirror
                  value={code}
                  height="500px"
                  theme={vscodeDark}
                  extensions={[javascript({ jsx: true })]}
                  onChange={onChange}
                  className="text-md"
                />
              </div>
            </div>

            {/* Output Section */}
            {output?.message && (
              <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-15">
                  <h3 className="text-lg font-semibold text-white">Output</h3>
                </div>
                <div className="p-4">
                  <div className="bg-gray-08 border border-gray-15 rounded-lg p-4">
                    <pre className={`text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto ${
                      output?.success ? 'text-white-90' : 'text-red-400'
                    }`}>
                      {output?.message}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Test Results */}
            {showTests && (
              <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-15">
                  <h3 className="text-lg font-semibold text-white">Test Results</h3>
                  {testResults.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                        passedTests === totalTests 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {passedTests}/{totalTests} passed
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="grid gap-4">
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
                            <span className="font-medium text-white">Test Case {result.testCase}</span>
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
                          <div className="flex items-start gap-3">
                            <span className="text-purple-60 font-medium min-w-16">Input:</span>
                            <code className="bg-gray-15 px-2 py-1 rounded text-white-90 flex-1">
                              {Array.isArray(result.input) ? result.input.join(', ') : result.input}
                            </code>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-emerald-400 font-medium min-w-16">Expected:</span>
                            <code className="bg-gray-15 px-2 py-1 rounded text-white-90 flex-1">
                              {result.expected}
                            </code>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className={`font-medium min-w-16 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                              Actual:
                            </span>
                            <code className="bg-gray-15 px-2 py-1 rounded text-white-90 flex-1">
                              {result.actual}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isSubmitting && testResults.length < data?.testCases?.length && (
                      <div className="border border-gray-30 rounded-lg p-4 bg-gray-15/30">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                          <span className="text-white-90">Running test case {testResults.length + 1}...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-15">
                <h3 className="text-lg font-semibold text-white">Test Inputs</h3>
                <p className="text-sm text-gray-60 mt-1">Modify inputs to test your code</p>
              </div>
              <div className="p-4">
                <div className="grid gap-3">
                  {inputs.map((input, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-white-90 mb-2">
                        Input {index + 1}
                      </label>
                      <Input
                        className="bg-gray-08 border-gray-15 text-white placeholder:text-gray-40 focus:border-purple-60 focus:ring-purple-60/20"
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
              </div>
            </div>

            {/* Problem Description */}
            <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-15">
                <h3 className="text-lg font-semibold text-white">{data?.title}</h3>
                <p className="text-sm text-gray-60 mt-1">Problem Description</p>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-4 text-white-90">
                  <p className="leading-relaxed">{data?.description}</p>

                  {data?.testCases?.[0] && (
                    <div>
                      <h4 className="font-semibold text-amber-400 mb-2">Example:</h4>
                      <div className="bg-gray-08 border border-gray-15 rounded-lg p-3">
                        <pre className="text-sm text-white-90">
                          <span className="text-purple-60">Input:</span> {Array.isArray(data.testCases[0].input) ? data.testCases[0].input.join(', ') : data.testCases[0].input}
                          {'\n'}
                          <span className="text-emerald-400">Output:</span> {data.testCases[0].expectedOutput}
                        </pre>
                      </div>
                    </div>
                  )}

                  {data?.constraints?.length > 0 && (
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

                  {data?.tags?.length > 0 && (
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

                  {data?.hints?.length > 0 && (
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        open={result?.dialog}
        title={result?.title}
        onClose={onResultModalClose}
      >
        <div className="text-center">
            {result?.message}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            {!result?.success && (
              <Button
                onClick={() => router.refresh()}
                className="bg-purple-60 hover:bg-purple-65 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
            )}
            <Button
              onClick={() => router.push('/explore')}
              className="bg-gray-15 hover:bg-gray-20 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <CircleArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </div>
      </Modal>
      <Celebration trigger={result?.success} duration={1500} />
    </div>
  );
};