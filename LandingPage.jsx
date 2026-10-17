import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Share2, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  BarChart3, 
  Send, 
  ExternalLink, 
  ChevronRight, 
  Lock
} from 'lucide-react';
import { Hero1 } from '@/components/ui/hero-1';

export default function LandingPage({ onStartChat, onOpenAccounts, onOpenSettings, onOpenAbout, accountsCount = 0 }) {
  const [activeTab, setActiveTab] = useState('schedule');

  const demoExamples = {
    schedule: {
      prompt: "Schedule a product launch post for tomorrow at 10:00 AM on LinkedIn and Twitter with our 2.0 release banner.",
      agent1: { tool: "schedule_post", channels: ["X (Twitter)", "LinkedIn"], scheduledFor: "Tomorrow 10:00 AM" },
      zenrioResult: { endpoint: "POST /v1/posts", status: "201 Created", postId: "zn_post_7819b" },
      response: "Scheduled your v2.0 Launch Announcement across X and LinkedIn for tomorrow at 10:00 AM UTC. Media and tracking hashtags have been verified."
    },
    dm: {
      prompt: "Check recent Instagram DMs and reply to @growth_marketer with our Enterprise pricing tier details.",
      agent1: { tool: "reply_dm", channels: ["Instagram"], recipient: "@growth_marketer" },
      zenrioResult: { endpoint: "POST /v1/inbox/conversations/msg_12/messages", status: "200 OK", messageId: "zn_msg_994a" },
      response: "Reviewed the inbound DM from @growth_marketer and dispatched the custom enterprise overview directly through Zenrio's Inbox API."
    },
    comments: {
      prompt: "Are there any unanswered questions on our launch tweet? If so, reply confirming support for 16+ platforms.",
      agent1: { tool: "reply_comment", channels: ["X (Twitter)"], target: "Launch Announcement Tweet" },
      zenrioResult: { endpoint: "POST /v1/comments/tw_884/reply", status: "200 OK" },
      response: "Found an inquiry on Twitter asking about channel coverage and answered immediately confirming multi-platform support via Zenrio."
    }
  };

  const currentDemo = demoExamples[activeTab];

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-indigo-500/30 font-sans">
      
      {/* Background radial glow & subtle grid */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="absolute inset-0 hero-grid pointer-events-none opacity-40" />

      {/* 21st.dev Hero Section Customized for SocialFlow AI */}
      <Hero1
        showHeader={false}
        onStartChat={onStartChat}
        onOpenAccounts={onOpenAccounts}
        accountsCount={accountsCount}
      />

      {/* Interactive Live Dual-AI Sandbox Preview */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/80 p-1 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
          
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-xs font-medium text-zinc-400">SocialFlow AI • Dual-Agent Workflow</span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'schedule' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Scheduling
              </button>
              <button
                onClick={() => setActiveTab('dm')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'dm' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                DM Inbox
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'comments' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Comments
              </button>
            </div>
          </div>

          {/* Interactive Chat Content */}
          <div className="p-6 space-y-6">
            
            {/* User Prompt */}
            <div className="flex justify-end">
              <div className="max-w-xl px-4 py-3 rounded-2xl rounded-tr-sm bg-zinc-800/90 text-sm text-zinc-100 border border-zinc-700/60 leading-relaxed">
                <span className="text-[10px] text-zinc-400 block mb-1 font-semibold uppercase tracking-wider">User Request:</span>
                {currentDemo.prompt}
              </div>
            </div>

            {/* Step 1: AI Agent Analyzing */}
            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Bot className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-indigo-300">Step 1: AI Agent (Intent & Tool Extractor)</span>
                </div>
                <span className="text-[11px] text-indigo-300 font-medium">Llama 3.3 70B</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] font-medium">Identified Tool</span>
                  <span className="text-zinc-200 font-semibold">{currentDemo.agent1.tool}</span>
                </div>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] font-medium">Target Channels</span>
                  <span className="text-zinc-200">{currentDemo.agent1.channels.join(', ')}</span>
                </div>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] font-medium">Execution Mode</span>
                  <span className="text-emerald-400 font-medium">Zenrio Automated Tool</span>
                </div>
              </div>
            </div>

            {/* Step 2: Zenrio API Tool Execution */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Share2 className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-cyan-300">Step 2: Zenrio API Execution</span>
                </div>
                <span className="text-emerald-400 font-medium">{currentDemo.zenrioResult.status}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
                <code className="text-zinc-300">{currentDemo.zenrioResult.endpoint}</code>
                <span className="text-zinc-400">Payload Validated</span>
              </div>
            </div>

            {/* Step 3: Response AI */}
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-zinc-200">Step 3: Response AI (Conversational Synthesis)</span>
                </div>
                <span className="text-zinc-400 text-xs font-medium">Natural Synthesis</span>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                {currentDemo.response}
              </p>
            </div>

          </div>

          {/* Bottom Interactive Bar */}
          <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-between rounded-b-xl flex-wrap gap-2">
            <span className="text-xs text-zinc-400">
              Ready to interact directly with your connected social channels?
            </span>
            <button
              onClick={onStartChat}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Open Chat Interface</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Dual-AI Workflow Breakdown Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
            The Two-Model Autonomous Pipeline
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            By decoupling tool decisioning from conversational response generation, SocialFlow AI achieves ultra-reliable execution with natural human communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Agent */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative group hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-indigo-400 uppercase tracking-wider block mb-1 font-semibold">Model 1</span>
            <h3 className="text-lg font-bold text-white mb-2">AI Agent (Action Tool)</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Analyzes the incoming prompt, verifies required parameters (schedule time, media URLs, targeted channels), and determines if an action is required or if it is a general inquiry.
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-900 text-xs text-zinc-500 font-medium">
              Output: Structured JSON Tool Payload
            </div>
          </div>

          {/* Card 2: Zenrio API */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative group hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-cyan-400 uppercase tracking-wider block mb-1 font-semibold">Execution Engine</span>
            <h3 className="text-lg font-bold text-white mb-2">Zenrio Unified API</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Dispatches authenticated requests to Zenrio's endpoints across 16+ social platforms. Handles scheduling, multi-account routing, media uploads, and error recovery.
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-900 text-xs text-zinc-500 font-medium">
              Output: Live API HTTP Result
            </div>
          </div>

          {/* Card 3: Response AI */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative group hover:border-zinc-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider block mb-1 font-semibold">Model 2</span>
            <h3 className="text-lg font-bold text-white mb-2">Response AI (Synthesis)</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Receives the execution report and writes a concise, user-friendly markdown response explaining the result, or replies normally when no tools were triggered.
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-900 text-xs text-zinc-500 font-medium">
              Output: Clean Conversational Debrief
            </div>
          </div>

        </div>
      </section>

      {/* Zenrio Supported Capabilities Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
            Everything Zenrio Can Do, Through Chat
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every capability in Zenrio's API reference is supported out-of-the-box in SocialFlow AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Send className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Create & Publish Posts</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Instantly broadcast copy, carousels, and media attachments to one or multiple social channels with automatic character limit adjustments.
            </p>
            <code className="block text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded">
              POST /v1/posts
            </code>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Schedule Campaigns</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Queue content for optimal time slots with automatic timezone synchronization. Preview calendar schedules anytime in chat.
            </p>
            <code className="block text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded">
              POST /v1/posts (scheduledFor)
            </code>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Message Inbox</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Read inbound customer inquiries and reply directly across Instagram, Twitter/X, and Facebook in one unified chat stream.
            </p>
            <code className="block text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded">
              POST /v1/inbox/conversations
            </code>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Comment Moderation</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Monitor public comments, answer customer queries automatically, or hide inappropriate engagement across all platforms.
            </p>
            <code className="block text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded">
              POST /v1/comments/:id/reply
            </code>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Audience & Reach Analytics</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Fetch cross-platform metrics, follower growth curves, and top-performing posts using conversational questions.
            </p>
            <code className="block text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded">
              GET /v1/analytics
            </code>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Manage Connected Profiles</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Monitor connected OAuth credentials, token expiration health, and permissions for each linked account.
            </p>
            <code className="block text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded">
              GET /v1/accounts
            </code>
          </div>

        </div>
      </section>

      {/* Supported Platforms Strip */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900 text-center">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-8 font-semibold">
          Seamless Multi-Platform Connectivity via Zenrio
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {[
            'Instagram', 'X (Twitter)', 'LinkedIn', 'Facebook', 'TikTok', 
            'YouTube', 'Threads', 'Bluesky', 'Reddit', 'Pinterest', 
            'WhatsApp', 'Discord', 'Slack', 'Google Business'
          ].map((platform, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium hover:border-zinc-700 hover:text-white transition-all shadow-sm"
            >
              {platform}
            </span>
          ))}
        </div>
      </section>

      {/* Zero-Backend / Privacy Pledge */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-zinc-900">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>100% Local Browser Security</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Your keys never leave your browser.</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                SocialFlow AI requires no backend database and runs entirely on client-side state. Your OpenRouter and Zenrio API keys are stored exclusively in your browser's Local Storage.
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={onOpenSettings}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Configure Local Keys</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950/60 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-zinc-300">SocialFlow AI</span>
            <span>— The Dual-AI Social Media Assistant</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onOpenAbout} className="hover:text-zinc-300 transition-colors">Architecture & Docs</button>
            <a href="https://docs.zernio.com" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
              <span>Zenrio API Reference</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
              <span>OpenRouter Free Models</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
