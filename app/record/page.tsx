"use client"
import React from 'react'
import { Button } from '../../Components/Dashboard/button'
import { Download, CheckCircle, Chrome, Mic, StopCircle, Settings, ArrowRight } from 'lucide-react'

const Page = () => {
  const handleDownload = () => {
    // Replace this URL with your actual extension file URL
    const extensionUrl = '/extensions/screen-recorder.vsix'
    const link = document.createElement('a')
    link.href = extensionUrl
    link.download = 'screen-recorder.vsix'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full mb-6">
              <Chrome className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Browser Extension</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Simple Screen Recording
            </h1>
            <p className="text-lg text-zinc-400 mb-8">
              Record your screen and audio with just two clicks
            </p>

            <div className="space-y-8">
              <Button 
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
              >
                <Download className="w-5 h-5" />
                Download Extension
              </Button>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                      <Chrome className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Click Extension Icon</h3>
                      <p className="text-zinc-400">Click the extension icon in your browser to start recording</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10">
                      <Mic className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Audio Processing</h3>
                      <p className="text-zinc-400">Extension captures and sends audio to our secure server</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10">
                      <StopCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Stop Recording</h3>
                      <p className="text-zinc-400">Click the extension icon again to stop recording</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-zinc-800/50 p-8 rounded-xl border border-zinc-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Installation Guide</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <Download className="w-5 h-5 text-blue-400" />,
                    title: "Download Extension",
                    description: "Click the download button to get the extension file"
                  },
                  {
                    icon: <Settings className="w-5 h-5 text-purple-400" />,
                    title: "Open Chrome Settings",
                    description: "Go to Chrome menu → More Tools → Extensions"
                  },
                  {
                    icon: <ArrowRight className="w-5 h-5 text-green-400" />,
                    title: "Enable Developer Mode",
                    description: "Toggle Developer Mode switch in top right corner"
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5 text-teal-400" />,
                    title: "Install Extension",
                    description: "Drag and drop the downloaded file into Chrome"
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-700/50">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{step.title}</h3>
                      <p className="text-zinc-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page