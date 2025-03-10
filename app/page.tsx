"use client"
import React from 'react';
import { authClient } from "@/lib/auth-client";
import { redirect } from 'next/navigation';

const Page = () => {
  const { data: session, isPending } = authClient.useSession();

  if (!isPending && session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Navigation */}
      <nav className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-200 fixed top-0 left-0 right-0 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-gray-900">Scrib</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-2 md:space-x-6 mr-3 md:mr-6 text-sm md:text-base">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 hidden md:inline">How it Works</a>
              <span className="text-gray-400 cursor-not-allowed hidden md:inline">Pricing (Coming Soon)</span>
              <div className="md:hidden flex items-center space-x-2">
                <span className="text-gray-400 cursor-not-allowed px-1 py-0.5">Pricing</span>
              </div>
            </div>
            {!isPending && !session ? (
              <button className="px-3 md:px-4 py-2 text-sm md:text-base rounded-md bg-black text-white hover:bg-gray-800 transition-colors whitespace-nowrap">
                Get Started
              </button>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:pt-48">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Your AI Meeting Assistant
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Scrib automatically records and summarizes key points so you can focus on the conversation.
          </p>
          {isPending ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : !session ? (
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 px-4">
              <button className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-base md:text-lg font-medium">
                Try Scrib Free
              </button>
              <button className="px-6 md:px-8 py-3 md:py-4 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors text-base md:text-lg font-medium">
                Watch Demo
              </button>
            </div>
          ) : null}
        </div>

        {/* AI Chat Demo */}
        <div className="mt-24 md:mt-32 bg-gray-50 rounded-xl p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Chat with Your Meeting Context</h2>
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3 md:p-4">
                  <p className="text-gray-700">&ldquo;What were the key decisions made in yesterday&apos;s product meeting?&rdquo;</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 md:p-4">
                  <p className="text-gray-700">&ldquo;In yesterday&apos;s product meeting, the team made three key decisions:</p>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>Prioritize the mobile app development for Q2</li>
                    <li>Integrate new AI features by end of month</li>
                    <li>Schedule user testing sessions for next week</li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <input type="text" placeholder="Ask about your meetings..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600" />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div id="features" className="scroll-mt-24 md:scroll-mt-32 mt-16 pt-24 md:pt-32 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">Smart Recording</h3>
            <p className="text-sm md:text-base text-gray-600">Automatically captures and transcribes your meetings with high accuracy.</p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">AI Summaries</h3>
            <p className="text-sm md:text-base text-gray-600">Get intelligent summaries of key points, action items, and decisions.</p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">Easy Integration</h3>
            <p className="text-sm md:text-base text-gray-600">Seamlessly works with your favorite meeting platforms and tools.</p>
          </div>
        </div>

        {/* Why Scrib Section */}
        <div id="why-scrib" className="scroll-mt-24 md:scroll-mt-32 mt-24 md:mt-32">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Scrib?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Time Savings */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-xl border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Save 5+ Hours Weekly</h3>
                  <p className="text-gray-600">Stop taking manual notes. Scrib captures everything automatically, letting you focus on the conversation while saving hours of note-taking time.</p>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-gradient-to-br from-green-50 to-white p-6 md:p-8 rounded-xl border border-green-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">99% Accuracy Rate</h3>
                  <p className="text-gray-600">Our advanced AI ensures highly accurate transcriptions and summaries, catching every important detail without missing context.</p>
                </div>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 md:p-8 rounded-xl border border-purple-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Enhanced Team Alignment</h3>
                  <p className="text-gray-600">Keep everyone on the same page with shared meeting summaries, action items, and searchable meeting history.</p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-xl border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Enterprise-Grade Security</h3>
                  <p className="text-gray-600">Your data is protected with end-to-end encryption, SOC 2 compliance, and granular access controls.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div id="how-it-works" className="scroll-mt-24 md:scroll-mt-32 mt-24 md:mt-32 bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">How it Works</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
                  <div className="absolute -top-4 left-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">1</div>
                  <div className="mt-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Install Extension</h3>
                    <p className="text-gray-600">Add our browser extension with a single click. Compatible with Chrome, Firefox, and Edge.</p>
                    <div className="mt-6 flex justify-center">
                      <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
                  <div className="absolute -top-4 left-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">2</div>
                  <div className="mt-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Start Recording</h3>
                    <p className="text-gray-600">Click the extension icon during your meeting. We&apos;ll automatically start capturing the conversation.</p>
                    <div className="mt-6 flex justify-center">
                      <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
                  <div className="absolute -top-4 left-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">3</div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Get AI Summary</h3>
                    <p className="text-gray-600">Our AI processes the recording in real-time, providing accurate transcription and smart summaries instantly.</p>
                    <div className="mt-6 flex justify-center">
                      <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-blue-900">All processing happens securely on our servers. Your data is encrypted end-to-end, and you can delete recordings at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8 md:mt-16 bg-white relative w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">Scrib</span>
              <span className="text-sm text-gray-500">© 2025</span>
            </div>
            <div className="flex space-x-4 md:space-x-6 text-sm">
              <a href="#help" className="text-gray-600 hover:text-gray-900 py-1">Help</a>
              <a href="#privacy" className="text-gray-600 hover:text-gray-900 py-1">Privacy</a>
              <a href="#terms" className="text-gray-600 hover:text-gray-900 py-1">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;