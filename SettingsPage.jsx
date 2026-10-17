import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Share2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Download, 
  Upload, 
  Trash2, 
  Sparkles, 
  Database, 
  Bot,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { DEFAULT_MODELS, DEFAULT_SETTINGS, storage } from '../services/storage';
import { openrouterService } from '../services/openrouterService';
import { zenrioService } from '../services/zenrioService';

export default function SettingsPage({ 
  settings = {}, 
  accounts = [], 
  user, 
  onSaveSettings, 
  onConnectZenrio, 
  onDisconnectAll, 
  onResetAll 
}) {
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...settings,
    agentModel: settings.agentModel && !settings.agentModel.includes('llama-3.3-70b') ? settings.agentModel : 'openrouter/free',
    responseModel: settings.responseModel && !settings.responseModel.includes('llama-3.3-70b') ? settings.responseModel : 'openrouter/free',
  }));
  const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [showZenrioKey, setShowZenrioKey] = useState(false);

  // Dynamic live catalog fetch
  useEffect(() => {
    let active = true;
    openrouterService.fetchFreeModels().then(liveModels => {
      if (active && Array.isArray(liveModels) && liveModels.length > 0) {
        setAvailableModels(liveModels);
      }
    });
    return () => { active = false; };
  }, []);

  // Testing states
  const [testingOpenRouter, setTestingOpenRouter] = useState(false);
  const [openRouterStatus, setOpenRouterStatus] = useState(null);

  const [testingZenrio, setTestingZenrio] = useState(false);
  const [zenrioStatus, setZenrioStatus] = useState(null);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e?.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestOpenRouter = async () => {
    setTestingOpenRouter(true);
    setOpenRouterStatus(null);
    const targetModel = formData.agentModel || 'openrouter/free';
    const result = await openrouterService.testConnection(formData.openRouterApiKey, targetModel);
    setTestingOpenRouter(false);
    setOpenRouterStatus(result);
  };

  const handleTestZenrio = async () => {
    setTestingZenrio(true);
    setZenrioStatus(null);
    const result = await zenrioService.authenticateAndFetchData(formData.zenrioApiKey);
    setTestingZenrio(false);
    setZenrioStatus(result);

    if (result.success && onConnectZenrio) {
      onConnectZenrio({
        apiKey: formData.zenrioApiKey,
        accounts: result.accounts,
        user: result.user,
      });
    }
  };

  const handleExportData = () => {
    const dataStr = storage.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = storage.importAllData(event.target.result);
      if (res.success) {
        alert('Configuration and data restored successfully! Reloading...');
        window.location.reload();
      } else {
        alert('Failed to import backup: ' + res.error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-transparent text-zinc-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Configuration
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              100% Client-Side Local Storage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            System & API Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure your OpenRouter AI models, Zenrio API keys, and autonomous agent behavior.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved locally</span>
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold shadow-md shadow-white/10 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. Zenrio API Configuration Card */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Zenrio Social Media API</h2>
                <p className="text-xs text-zinc-400">Connects SocialFlow AI to your real social platforms</p>
              </div>
            </div>

            <a
              href="https://docs.zernio.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <span>Zenrio Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Zenrio API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">Zenrio API Key (Bearer Token)</label>
              <span className="text-[11px] text-zinc-500">Stored safely in browser only</span>
            </div>

            <div className="relative">
              <input
                type={showZenrioKey ? 'text' : 'password'}
                placeholder="zen_live_... or your bearer token"
                value={formData.zenrioApiKey || ''}
                onChange={(e) => handleChange('zenrioApiKey', e.target.value)}
                className="w-full pl-3.5 pr-28 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowZenrioKey(!showZenrioKey)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200"
                >
                  {showZenrioKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestZenrio}
                  disabled={testingZenrio || !formData.zenrioApiKey?.trim()}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 disabled:opacity-40 transition-colors"
                >
                  {testingZenrio ? 'Verifying...' : 'Verify & Sync'}
                </button>
              </div>
            </div>

            {zenrioStatus && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 mt-2 animate-fade-in ${
                zenrioStatus.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}>
                {zenrioStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                <div>
                  <span className="font-semibold block mb-0.5">
                    {zenrioStatus.success ? 'Zenrio API Key Verified' : 'Connection Failed'}
                  </span>
                  <span className="leading-relaxed">
                    {zenrioStatus.success 
                      ? `Successfully synchronized ${zenrioStatus.accounts?.length || 0} social account(s).` 
                      : zenrioStatus.error}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Timezone Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Default Scheduling Timezone</label>
              <input
                type="text"
                value={formData.defaultTimezone || 'UTC'}
                onChange={(e) => handleChange('defaultTimezone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-zinc-500 block">
                SocialFlow schedules your posts based on this timezone.
              </span>
            </div>

            {/* Persona / Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Agent Persona Tone</label>
              <select
                value={formData.agentTone || 'growth_hacker'}
                onChange={(e) => handleChange('agentTone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="growth_hacker">Growth Hacker (High engagement, punchy, strategic)</option>
                <option value="professional">Executive & Professional (Polished, corporate)</option>
                <option value="casual">Casual & Conversational (Friendly, authentic)</option>
                <option value="minimalist">Minimalist (Brief, concise, data-driven)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. OpenRouter AI Models Card */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">OpenRouter AI Configuration</h2>
                <p className="text-xs text-zinc-400">Select free LLMs to power the Dual-AI workflow</p>
              </div>
            </div>

            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* OpenRouter API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">OpenRouter API Key (Optional for Live Models)</label>
              <span className="text-[11px] text-zinc-500">Free models available</span>
            </div>
            
            <div className="relative">
              <input
                type={showOpenRouterKey ? 'text' : 'password'}
                placeholder="sk-or-v1-..."
                value={formData.openRouterApiKey || ''}
                onChange={(e) => handleChange('openRouterApiKey', e.target.value)}
                className="w-full pl-3.5 pr-28 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200"
                >
                  {showOpenRouterKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestOpenRouter}
                  disabled={testingOpenRouter || !formData.openRouterApiKey?.trim()}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 disabled:opacity-40 transition-colors"
                >
                  {testingOpenRouter ? 'Testing...' : 'Ping Test'}
                </button>
              </div>
            </div>

            {openRouterStatus && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 mt-2 animate-fade-in ${
                openRouterStatus.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}>
                {openRouterStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="font-semibold block">
                    {openRouterStatus.success
                      ? `OpenRouter API Verified (HTTP ${openRouterStatus.statusCode || 200})`
                      : `OpenRouter Verification Failed (HTTP ${openRouterStatus.statusCode || 'Error'})`}
                  </span>
                  <span className="leading-relaxed block break-words">
                    {openRouterStatus.success
                      ? `Model "${openRouterStatus.model}" is active and responded successfully.`
                      : openRouterStatus.error}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Model Selection Dropdown (Free Models) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Agent Model (Intent & Tool Extractor)</span>
              </label>
              <select
                value={formData.agentModel || 'openrouter/free'}
                onChange={(e) => handleChange('agentModel', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.badge ? `• [${m.badge}]` : ''}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-zinc-500 block">
                Responsible for understanding instructions and formatting Zenrio parameters.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Response AI Model (Conversational Synthesis)</span>
              </label>
              <select
                value={formData.responseModel || 'openrouter/free'}
                onChange={(e) => handleChange('responseModel', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.badge ? `• [${m.badge}]` : ''}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-zinc-500 block">
                Responsible for crafting natural, user-friendly responses and strategic summaries.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Local Storage Backup & Data Management */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Local Storage & Privacy Control</h2>
              <p className="text-xs text-zinc-400">Manage your local workspace backup or disconnect completely</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export JSON Backup</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-zinc-200 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Disconnect and clear all account data, chat history, and local settings?')) {
                  onDisconnectAll();
                  alert('All local account and session data cleared.');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-xs font-medium text-rose-300 transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Data & Disconnect</span>
            </button>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold shadow-lg shadow-white/10 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
}
