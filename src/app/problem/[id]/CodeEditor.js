"use client";
import React, { useState } from 'react';
import { Play, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import Typography from '../../components/ui/Typography';
import Chip from '@/components/ui/Chip';
import Input from '@/components/ui/Input';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import useAuth from '@/hooks/useAuth';
import { saveProblemResult } from '@/api/firebase/userProgress';

export default function CodeEditor ({ data }){
  const { user } = useAuth();
  const [code, setCode] = useState(data?.starterCode || `function solution(arr) {
    // Write your code here
  }`);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState({success: true, message: ''});
  const [inputs, setInputs] = useState(data?.testCases?.[0]?.input || []);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput({success: true, message: 'Running code...'});
    setShowTests(false);
    let tempInputs = inputs.map(ipt => safeParse(ipt));
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
            expected: testCase.output,
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
              expected: testCase.output,
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
              const expectedOutput = JSON.parse(testCase.output);
              passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
            } catch {
              // Fallback to string comparison if parsing fails
              passed = actualOutput.toString() === testCase.output.toString();
            }
            
            result = {
              testCase: index + 1,
              input: testCase.input,
              expected: testCase.output,
              actual: JSON.stringify(actualOutput),
              passed,
              status: passed ? { description: 'Accepted' } : { description: 'Wrong Answer' }
            };
          } else {
            result = {
              testCase: index + 1,
              input: testCase.input,
              expected: testCase.output,
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
            expected: testCase.output,
            actual: 'No response received',
            passed: false,
            status: { description: 'Error' }
          };
        }
        
        allResults.push(result);
      });
      let perfectScore = allResults.filter(r => r.passed).length === data.testCases.length
      await saveProblemResult(user.uid, data._id, perfectScore)

    } catch (error) {
      // Handle network errors or other exceptions
      data.testCases.forEach((testCase, index) => {
        const errorResult = {
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.output,
          actual: `Execution Error: ${error.message}`,
          passed: false,
          status: { description: 'Error' }
        };
        allResults.push(errorResult);
      });
    }
    
    setTestResults(allResults);
    setIsSubmitting(false);
  };

  const getStatusIcon = (result) => {
    if (result.passed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const onChange = (value, viewUpdate) => {
    setCode(value);
  }

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  return (
  <div>
    <div className="max-w-screen-2xl mx-auto px-4 py-5">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5">
        {/* Left: Editor, Output, Tests */}
        <div className="space-y-7 flex flex-col">
          {/* Editor Card */}
          <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-15">
              <div>
                <h2 className="text-xl font-bold text-white">Code Editor</h2>
                <p className="text-sm text-gray-60 mt-1">
                  Write your solution below
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2 bg-purple-60 hover:bg-purple-65 disabled:bg-gray-30 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
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
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-30 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
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
            <div>
              <CodeMirror
                value={code}
                height="420px"
                theme={vscodeDark}
                extensions={[javascript({ jsx: true })]}
                onChange={onChange}
                className="text-md"
              />
            </div>
          </div>

          {/* Output */}
          {output?.message && (
            <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-gray-15">
                <h3 className="text-lg font-semibold text-white">Output</h3>
              </div>
              <div className="p-5">
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
              <div className="flex justify-between items-center p-5 border-b border-gray-15">
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
              <div className="p-5 grid gap-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      result.passed
                        ? 'border-emerald-500/30 bg-emerald-500/8'
                        : 'border-red-500/30 bg-red-500/8'
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
                    <div className="space-y-1 text-sm">
                      <div className="flex gap-3">
                        <span className="text-purple-60 min-w-16">Input:</span>
                        <code className="bg-gray-15 px-2 py-1 rounded text-white-90 flex-1">
                          {Array.isArray(result.input) ? result.input.join(', ') : result.input}
                        </code>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-emerald-400 min-w-16">Expected:</span>
                        <code className="bg-gray-15 px-2 py-1 rounded text-white-90 flex-1">
                          {result.expected}
                        </code>
                      </div>
                      <div className="flex gap-3">
                        <span className={`${result.passed ? 'text-emerald-400' : 'text-red-400'} min-w-16`}>
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
                  <div className="border border-gray-30 rounded-lg p-4 bg-gray-15/30 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span className="text-white-90">
                      Running test case {testResults.length + 1}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Inputs / Problem */}
        <div className="flex flex-col space-y-7">
          {/* Inputs */}
          <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-gray-15">
              <h3 className="text-lg font-semibold text-white">Test Inputs</h3>
              <p className="text-sm text-gray-60 mt-1">Modify inputs to test your code</p>
            </div>
            <div className="p-3 space-y-4">
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

          {/* Problem Description */}
          <div className="bg-gray-10 border border-gray-15 rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-15">
              <h3 className="text-lg font-semibold text-white">{data?.title}</h3>
              <p className="text-sm text-gray-60 mt-1">Problem Description</p>
            </div>
            <div className="p-3 space-y-4 overflow-y-auto max-h-96 flex-1 text-white-90">
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
);

};