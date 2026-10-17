import React from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Code2
} from 'lucide-react';

export default function AboutPage({ onStartChat, onOpenSettings }) {
  const zenrioEndpoints = [
    { method: 'POST', path: '/v1/posts', desc: 'Create & publish or schedule posts across multiple connected channels' },
    { method: 'GET', path: '/v1/posts', desc: 'List historical posts, filter by status (published, scheduled, draft, queued)' },
    { method: 'DELETE', path: '/v1/posts/{id}', desc: 'Cancel scheduled post or remove published content' },
    { method: 'POST', path: '/v1/comments/{id}/reply', desc: 'Reply to comments across supported platforms' },
    { method: 'GET', path: '/v1/inbox/conversations', desc: 'Fetch direct message threads from Instagram, Twitter, WhatsApp, etc.' },
    { method: 'POST', path: '/v1/inbox/conversations/{id}/messages', desc: 'Dispatch replies to customer DMs' },
    { method: 'GET', path: '/v1/accounts', desc: 'Retrieve connected social media platform logins and IDs' },
    { method: 'GET', path: '/v1/analytics', desc: 'Retrieve impressions, engagement rates, and follower growth metrics' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-transparent text-zinc-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-12 animate-fade-in font-sans">
      
      {/* Hero Header */}
      <div className="space-y-4 border-b border-zinc-800/80 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>System Architecture & Integration Manual</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          About SocialFlow AI
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
          SocialFlow AI bridges cutting-edge conversational intelligence with Zenrio's multi-platform social media API. It enables teams, founders, and creators to run end-to-end social operations strictly through natural dialogue.
        </p>
      </div>

      {/* The 7-Step Workflow Explanation */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>The 7-Step Dual-AI Workflow</span>
          </h2>
          <p className="text-xs text-zinc-400">
            How SocialFlow AI decouples intent detection from conversational response delivery
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-indigo-400">Step 1 • User Message</span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                The user inputs a natural language request (e.g. <em>"Schedule a product launch post for tomorrow at 10 AM on LinkedIn and Twitter"</em>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-indigo-400">Step 2 • AI Agent Evaluation</span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong>Model 1 (AI Agent)</strong> evaluates the request against available tools and extracts required parameters (target channels, timestamps, media URLs).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-indigo-400">Step 3 • Action Generation</span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                If an action is required, the AI Agent generates a structured JSON tool action (e.g. <code>schedule_post</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-cyan-400">Step 4 • Zenrio API Execution</span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                The action is executed against Zenrio's REST API (<code>POST /v1/posts</code>), verifying scheduling queue slots and target account IDs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-emerald-400">Step 5 • Result Handoff</span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                The Zenrio execution response (status code, post ID, scheduled confirmation) is captured and passed to the second AI.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-emerald-400">Step 6 • Response AI Synthesis</span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong>Model 2 (Response AI)</strong> generates a natural, user-friendly markdown response explaining the completed action, highlights, and tactical guidance.
              </p>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
            <strong>Step 7 (No Action Path):</strong> If no social action is required (e.g. brainstorming ideas, asking for tips, or querying strategy), Model 2 responds directly to the user without calling any tools.
          </div>
        </div>
      </section>

      {/* Zenrio API Reference Table */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span>Supported Zenrio API Capabilities</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Built to standard specifications from <a href="https://docs.zernio.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">docs.zernio.com</a>
            </p>
          </div>
          <a
            href="https://docs.zernio.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs text-cyan-400 hover:underline"
          >
            <span>Official Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
          <div className="divide-y divide-zinc-800/80">
            {zenrioEndpoints.map((ep, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-zinc-900/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === 'POST' ? 'bg-indigo-500/20 text-indigo-300' :
                    ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-zinc-200 text-xs">{ep.path}</code>
                </div>
                <span className="text-zinc-400 text-xs sm:text-right max-w-md">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zero Backend & Security Pledge */}
      <section className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase tracking-wider font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Architectural Guarantees</span>
        </div>
        <h2 className="text-xl font-bold text-white">Client-Only Architecture with Zero Cloud Database</h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Unlike traditional social management tools that store user passwords, OAuth tokens, and conversation transcripts on centralized database servers, SocialFlow AI runs 100% locally inside your web browser.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-300">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] font-medium">API Key Storage</span>
            <span className="font-semibold">Local Storage Only</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] font-medium">Backend Server</span>
            <span className="font-semibold">None (Serverless Client)</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] font-medium">Data Portability</span>
            <span className="font-semibold">Instant JSON Export</span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800">
        <span className="text-xs text-zinc-400">Ready to experience autonomous social media orchestration?</span>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
          >
            Configure API Keys
          </button>
          <button
            onClick={onStartChat}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-md shadow-white/10 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Open Chat Assistant</span>
          </button>
        </div>
      </div>

    </div>
  );
}
