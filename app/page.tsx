"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Link from 'next/link';
import {
  NotebookPen,
  ClipboardList,
  Globe,
  Share,
  UserCircle,
  ChevronRight,
  Lock,
  CircleDot
} from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (!isPending && session) {
    router.push('/dashboard');
  }

  const handleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard'
      });
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors">
                Scrib
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link href="#features" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                  Features
                </Link>
                <Link href="#demo" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                  Demo
                </Link>
                <Link href="#pricing" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isPending ? (
                <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
              ) : session ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero and Demo Section */}
        <div className="flex flex-col lg:flex-row items-start gap-12 py-36">
          {/* Hero Section */}
          <div className="flex-1 py-">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-600">AI-Powered Meeting Assistant</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Transform meetings into insights</h1>
              <p className="text-lg text-gray-600 mb-6">Let AI handle your meeting notes</p>
              <div className="flex items-center gap-4">
                <button onClick={handleSignIn} className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Get Started
                </button>
                <a href="#features" className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                  Learn More
                </a>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border">
                <Lock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Enterprise-grade encryption for all meetings</span>
              </div>
            </div>
          </div>

          {/* Demo Section */}
          <div className="flex-1" id="demo">
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-600">Product team weekly meeting</div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Share className="h-4 w-4" />
                  <UserCircle className="h-4 w-4" />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">AI</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900">Welcome! I'm your AI meeting assistant. I'll help you capture and summarize your meetings. Would you like to see a demo?</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">U</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900">Yes, show me how it works</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">AI</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900">Great! Here's a quick overview:</p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <p className="text-sm text-gray-600">• Start your meeting and I'll listen in</p>
                      <p className="text-sm text-gray-600">• I'll transcribe everything in real-time</p>
                      <p className="text-sm text-gray-600">• After the meeting, I'll provide a summary with key points</p>
                      <p className="text-sm text-gray-600">• You can ask questions about any part of the meeting</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">U</div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg pr-24 text-sm text-gray-900 placeholder-gray-500"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-24 border-t" id="features">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">Everything you need</h2>
              <p className="mt-2 text-gray-600">Powerful features to transform your meetings</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-white rounded-xl border hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <CircleDot className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Recording</h3>
                <p className="text-sm text-gray-600">Automatically capture every detail of your meetings with perfect accuracy.</p>
              </div>

              <div className="group p-6 bg-white rounded-xl border hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summaries</h3>
                <p className="text-sm text-gray-600">Get instant, actionable summaries powered by advanced AI technology.</p>
              </div>

              <div className="group p-6 bg-white rounded-xl border hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                <p className="text-sm text-gray-600">End-to-end encryption and secure storage for all your sensitive meeting data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 border-t" id="pricing">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">Simple, transparent pricing</h2>
              <p className="mt-2 text-gray-600">Choose the plan that best fits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-white p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                    <span className="ml-2 text-sm text-gray-600">/month</span>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Up to 5 meetings/month
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Basic AI summaries
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    7-day history
                  </div>
                </div>
                <button onClick={handleSignIn} className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                  Get Started
                </button>
              </div>

              <div className="group bg-white p-6 rounded-xl border hover:shadow-md transition-all relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-medium">Popular</span>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">$19</span>
                    <span className="ml-2 text-sm text-gray-600">/month</span>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Unlimited meetings
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Advanced AI insights
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    30-day history
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Priority support
                  </div>
                </div>
                <button onClick={handleSignIn} className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                  Get Started
                </button>
              </div>

              <div className="group bg-white p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Everything in Pro
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Custom integrations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Dedicated support
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">✓</div>
                    Custom retention
                  </div>
                </div>
                <button onClick={handleSignIn} className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 border-t" id="how-it-works">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Scrib Works</h2>
            <div className="relative">
              <div className="hidden md:block absolute top-[2.25rem] left-0 right-0 h-px bg-gray-200"></div>
              <div className="md:hidden absolute left-[2.25rem] top-0 bottom-0 w-px bg-gray-200"></div>
              
              <div className="flex md:flex-row flex-col md:items-start items-start md:gap-8 gap-6 relative z-10">
                <div className="flex md:flex-col flex-row md:text-center text-left md:items-center items-start gap-4 md:flex-1">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0 border shadow-sm">
                    <span className="text-xl font-bold text-gray-900">01</span>
                  </div>
                  <div className="bg-white md:px-4">
                    <h3 className="text-sm font-semibold text-gray-800">Start Recording</h3>
                    <p className="text-xs text-gray-600">Begin your meeting</p>
                  </div>
                </div>

                <div className="flex md:flex-col flex-row md:text-center text-left md:items-center items-start gap-4 md:flex-1">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0 border shadow-sm">
                    <span className="text-xl font-bold text-gray-900">02</span>
                  </div>
                  <div className="bg-white md:px-4">
                    <h3 className="text-sm font-semibold text-gray-800">AI Processing</h3>
                    <p className="text-xs text-gray-600">Real-time analysis</p>
                  </div>
                </div>

                <div className="flex md:flex-col flex-row md:text-center text-left md:items-center items-start gap-4 md:flex-1">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0 border shadow-sm">
                    <span className="text-xl font-bold text-gray-900">03</span>
                  </div>
                  <div className="bg-white md:px-4">
                    <h3 className="text-sm font-semibold text-gray-800">Get Insights</h3>
                    <p className="text-xs text-gray-600">Instant summaries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-gray-900 font-semibold">
                Scrib
              </Link>
              <span className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} All rights reserved
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;