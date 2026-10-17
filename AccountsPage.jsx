import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  X, 
  Search, 
  Users, 
  ShieldCheck, 
  Key,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { zenrioService } from '../services/zenrioService';

export default function AccountsPage({ 
  accounts = [], 
  onUpdateAccounts, 
  onConnectZenrio, 
  onDisconnectAll,
  settings = {}, 
  user,
  onOpenSettings 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [modalApiKey, setModalApiKey] = useState(settings.zenrioApiKey || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = 
      (acc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (acc.handle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.platform || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterPlatform === 'all' || acc.platform === filterPlatform;
    return matchesSearch && matchesFilter;
  });

  const totalFollowers = accounts.reduce((acc, curr) => acc + (curr.followers || 0), 0);
  const activeCount = accounts.filter(a => a.status === 'connected' || a.status === 'active').length;

  const handleRefreshAccounts = async () => {
    if (!settings.zenrioApiKey) {
      setSyncFeedback({
        success: false,
        message: 'No Zenrio API key saved. Please add your key first.',
      });
      setTimeout(() => setSyncFeedback(null), 4000);
      return;
    }

    setIsRefreshing(true);
    setSyncFeedback(null);

    const result = await zenrioService.authenticateAndFetchData(settings.zenrioApiKey);
    setIsRefreshing(false);

    if (result.success) {
      onConnectZenrio({
        apiKey: settings.zenrioApiKey,
        accounts: result.accounts,
        user: result.user,
      });
      setSyncFeedback({
        success: true,
        message: `Successfully synchronized ${result.accounts.length} account${result.accounts.length === 1 ? '' : 's'} from Zenrio.`,
      });
    } else {
      setSyncFeedback({
        success: false,
        message: result.error || 'Failed to sync with Zenrio API.',
      });
    }
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  const handleConnectWithApiKey = async (e) => {
    e.preventDefault();
    const key = modalApiKey.trim();
    if (!key) {
      setConnectError('Please enter a valid Zenrio API key.');
      return;
    }

    setIsConnecting(true);
    setConnectError(null);

    const result = await zenrioService.authenticateAndFetchData(key);
    setIsConnecting(false);

    if (result.success) {
      onConnectZenrio({
        apiKey: key,
        accounts: result.accounts,
        user: result.user,
      });
      setShowConnectModal(false);
      setConnectError(null);
      setSyncFeedback({
        success: true,
        message: `Connected! Loaded ${result.accounts.length} social account${result.accounts.length === 1 ? '' : 's'}.`,
      });
      setTimeout(() => setSyncFeedback(null), 4000);
    } else {
      setConnectError(result.error || 'Unable to authenticate with Zenrio API.');
    }
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      const remaining = accounts.filter(a => a.id !== id);
      onUpdateAccounts(remaining);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-transparent text-zinc-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Social Media Accounts
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
              Zenrio API
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Connected Accounts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your synchronized social media profiles. All data is fetched directly from the Zenrio API.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {accounts.length > 0 && (
            <>
              <button
                onClick={handleRefreshAccounts}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-xs font-medium text-zinc-300 border border-zinc-800 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : 'text-zinc-400'}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync via Zenrio'}</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Disconnect all social accounts and clear profile data?')) {
                    onDisconnectAll();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 border border-zinc-800 transition-colors"
                title="Disconnect all accounts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect All</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              setModalApiKey(settings.zenrioApiKey || '');
              setConnectError(null);
              setShowConnectModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all shadow-md shadow-white/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Account</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-fade-in ${
          syncFeedback.success 
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
        }`}>
          {syncFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span className="font-medium">{syncFeedback.message}</span>
        </div>
      )}

      {/* Overview Stat Cards (Shown only when accounts exist) */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-medium">Total Audience</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {totalFollowers.toLocaleString()}
            </div>
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              Across {accounts.length} connected channel{accounts.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-medium">Active Channels</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {activeCount} / {accounts.length}
            </div>
            <span className="text-[11px] text-zinc-500">
              Verified through Zenrio
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-medium">Primary Profile</span>
              <Share2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-zinc-100 truncate">
              {user?.name || accounts[0]?.name || 'Connected'}
            </div>
            <span className="text-[11px] text-zinc-400 truncate block">
              {user?.handle || accounts[0]?.handle || ''}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-medium">API Integration</span>
              <ShieldCheck className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-violet-400 tracking-tight">
              Live
            </div>
            <span className="text-[11px] text-zinc-500">
              Direct client-side gateway
            </span>
          </div>
        </div>
      )}

      {/* Main Content: Either Empty State or Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/90 text-center max-w-2xl mx-auto space-y-5 animate-fade-in shadow-xl shadow-black/40">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 shadow-sm">
            <Share2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              No Social Accounts Connected
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Connect your Zenrio API key to synchronize your social media profiles. SocialFlow AI will interact directly with your real accounts for posting, scheduling, and community management.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setModalApiKey(settings.zenrioApiKey || '');
                setConnectError(null);
                setShowConnectModal(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold shadow-lg shadow-white/10 active:scale-95 transition-all"
            >
              <Key className="w-4 h-4 text-zinc-900" />
              <span>Connect via Zenrio API Key</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
            >
              Configure in Settings
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-900 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Frontend-Only. Your API key and account data are saved strictly in your browser.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search & Platform Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, handle, or platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {['all', 'x', 'linkedin', 'instagram', 'facebook', 'threads', 'youtube'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                    filterPlatform === p
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {p === 'x' ? 'X (Twitter)' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Connected Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAccounts.map((acc) => {
              const isConnected = acc.status === 'connected' || acc.status === 'active';

              return (
                <div
                  key={acc.id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700/80 transition-all space-y-4 relative group shadow-lg shadow-black/20"
                >
                  {/* Card Header: Avatar, Name, Handle, Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-11 h-11 rounded-xl object-cover ring-1 ring-zinc-800"
                        />
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ backgroundColor: acc.color || '#6366f1' }}
                        >
                          {acc.platform.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-zinc-100 truncate max-w-[150px]">
                          {acc.name}
                        </span>
                        <span className="text-xs text-zinc-400 truncate max-w-[150px]">
                          {acc.handle}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        isConnected 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span>{isConnected ? 'Active' : 'Attention'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Followers & Platform Row */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-medium">Followers</span>
                      <span className="text-zinc-200 font-semibold text-sm">
                        {acc.followers ? acc.followers.toLocaleString() : '0'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-medium">Platform</span>
                      <span className="text-indigo-400 font-semibold text-xs">
                        {acc.platformName}
                      </span>
                    </div>
                  </div>

                  {/* Capabilities Pill Badges */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase text-zinc-500 tracking-wider font-medium">
                      Zenrio Actions Supported
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(acc.capabilities || ['create_post', 'schedule_post', 'manage_comments']).map((cap, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 text-[10px] border border-zinc-800 capitalize"
                        >
                          {cap.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
                    <span className="text-[10px]">
                      Account ID: {acc.id}
                    </span>

                    <button
                      onClick={() => handleDeleteAccount(acc.id)}
                      className="p-1 hover:text-rose-400 text-zinc-500 transition-colors"
                      title="Disconnect Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect Social Accounts</h3>
                  <p className="text-xs text-zinc-400">Authenticate with your Zenrio API credentials</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowConnectModal(false);
                  setConnectError(null);
                }}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {connectError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{connectError}</span>
              </div>
            )}

            <form onSubmit={handleConnectWithApiKey} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Zenrio API Key (Bearer Token)</label>
                  <a
                    href="https://docs.zernio.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Get API Key</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="zen_live_... or your bearer token"
                  value={modalApiKey}
                  onChange={(e) => setModalApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-zinc-500 block">
                  The API key is stored 100% locally in your browser's LocalStorage and used to query Zenrio endpoints directly.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real Account Verification</span>
                </div>
                <p className="leading-relaxed">
                  When you submit, SocialFlow will make an authenticated <code className="text-zinc-300">GET /v1/accounts</code> request to Zenrio to pull your real connected profiles and populate your workspace.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectModal(false);
                    setConnectError(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting || !modalApiKey.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating with Zenrio...</span>
                    </>
                  ) : (
                    <>
                      <span>Connect & Fetch Accounts</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
