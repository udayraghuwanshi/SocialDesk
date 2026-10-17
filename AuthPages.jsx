import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff
} from 'lucide-react';

export function LoginPage({ onLoginSuccess, onSwitchToSignup, onOpenAccounts }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = email.split('@')[0] || 'SocialFlow User';
    onLoginSuccess({
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      handle: `@${userName}`,
      email: email || 'user@socialflow.ai',
      avatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="20" fill="%234f46e5"/><text x="50%" y="54%" font-family="system-ui, sans-serif" font-size="34" font-weight="600" fill="white" dominant-baseline="middle" text-anchor="middle">${userName.charAt(0).toUpperCase()}</text></svg>`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-transparent relative font-sans">
      <div className="absolute inset-0 radial-glow pointer-events-none opacity-60" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl relative z-10 backdrop-blur-xl space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="text-xs text-zinc-400">
            Sign in to manage your connected social channels via AI
          </p>
        </div>

        {/* Quick Zenrio API Connect Shortcut */}
        <button
          type="button"
          onClick={onOpenAccounts}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition-all group"
        >
          <Key className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Connect Direct with Zenrio API Key</span>
        </button>

        <div className="flex items-center gap-3 text-zinc-700">
          <div className="flex-1 h-[1px] bg-zinc-800" />
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Or continue with email</span>
          <div className="flex-1 h-[1px] bg-zinc-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all shadow-md shadow-white/10 active:scale-95"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-zinc-500">
          <span>Don't have an account yet? </span>
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-indigo-400 hover:underline font-medium"
          >
            Create account
          </button>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-center gap-2 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>100% Client-side. No credentials are transmitted to any server.</span>
        </div>

      </div>
    </div>
  );
}

export function SignUpPage({ onLoginSuccess, onSwitchToLogin, onOpenAccounts }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim() || 'SocialFlow Creator';
    onLoginSuccess({
      name: cleanName,
      handle: `@${cleanName.toLowerCase().replace(/\s+/g, '')}`,
      email: email || 'creator@socialflow.ai',
      avatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="20" fill="%234f46e5"/><text x="50%" y="54%" font-family="system-ui, sans-serif" font-size="34" font-weight="600" fill="white" dominant-baseline="middle" text-anchor="middle">${cleanName.charAt(0).toUpperCase()}</text></svg>`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-transparent relative font-sans">
      <div className="absolute inset-0 radial-glow pointer-events-none opacity-60" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl relative z-10 backdrop-blur-xl space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
          <p className="text-xs text-zinc-400">
            Start automating your social workflow with Dual-AI & Zenrio
          </p>
        </div>

        {/* Quick Zenrio API Connect Shortcut */}
        <button
          type="button"
          onClick={onOpenAccounts}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition-all group"
        >
          <Key className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Connect Direct with Zenrio API Key</span>
        </button>

        <div className="flex items-center gap-3 text-zinc-700">
          <div className="flex-1 h-[1px] bg-zinc-800" />
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Or create profile</span>
          <div className="flex-1 h-[1px] bg-zinc-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Your Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all shadow-md shadow-white/10 active:scale-95"
          >
            <span>Create Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-zinc-500">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-400 hover:underline font-medium"
          >
            Sign in
          </button>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-center gap-2 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Stored 100% locally in your browser. Zero tracking.</span>
        </div>

      </div>
    </div>
  );
}
