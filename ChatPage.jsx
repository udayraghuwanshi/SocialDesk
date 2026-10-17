import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Settings, 
  Trash2, 
  Sparkles, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Sidebar from '../components/layout/Sidebar';
import MessageItem from '../components/chat/MessageItem';
import AgentThinkingBubble from '../components/chat/AgentThinkingBubble';
import ChatInput from '../components/chat/ChatInput';
import { openrouterService } from '../services/openrouterService';
import { resolveContext } from '../services/contextResolver';

export default function ChatPage({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onUpdateConversation,
  accounts = [],
  settings = {},
  onOpenSettings,
  onOpenAccounts
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepInfo, setCurrentStepInfo] = useState(null);
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const prevConvIdRef = useRef(activeConversationId);

  // Auto scroll to bottom without lag on conversation switch
  useEffect(() => {
    if (prevConvIdRef.current !== activeConversationId) {
      prevConvIdRef.current = activeConversationId;
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages?.length, activeConversationId, isLoading, currentStepInfo]);

  // Handle sending a new message
  const handleSendMessage = async ({ text, accountIds, imageUrl }) => {
    if (!activeConversation) {
      onNewConversation();
      return;
    }

    const userMessageId = 'msg_user_' + Date.now();
    const userMessage = {
      id: userMessageId,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: text,
      imageUrl: imageUrl || null,
    };

    // Append user message immediately
    const updatedMessages = [...(activeConversation.messages || []), userMessage];
    const updatedConv = {
      ...activeConversation,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };
    onUpdateConversation(updatedConv);

    // --- Context resolution: ordinal picks and follow-up edits ---
    // Pass the messages BEFORE the user message was appended so we
    // resolve against the prior assistant turn only.
    const ctx = resolveContext(text, activeConversation.messages || []);

    // If clarification is needed (e.g. "3rd one" with no prior list),
    // respond immediately without calling the AI pipeline.
    if (ctx.needsClarification) {
      const clarificationMsg = {
        id: 'msg_asst_' + Date.now(),
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: ctx.clarificationPrompt,
      };
      onUpdateConversation({
        ...activeConversation,
        title: activeConversation.title === 'New Conversation'
          ? (text.slice(0, 32) + (text.length > 32 ? '...' : ''))
          : activeConversation.title,
        messages: [...updatedMessages, clarificationMsg],
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    // Use the resolved text for the AI pipeline; keep the original text
    // in the message bubble so the user sees what they typed.
    const textForAI = ctx.resolvedText;

    setIsLoading(true);
    setCurrentStepInfo({ step: 1, label: ctx.wasResolved
      ? `Resolving: ${ctx.resolutionLabel} …`
      : 'AI Agent evaluating prompt against connected channels...'
    });

    try {
      // Execute the complete Dual-Agent pipeline:
      // Agent 1 -> Zenrio API Execution -> Agent 2 Response
      const dualAgentResponse = await openrouterService.executeDualAgentWorkflow({
        userMessage: textForAI,
        settings,
        accounts,
        conversationHistory: updatedMessages,
        onStepUpdate: (stepInfo) => setCurrentStepInfo(stepInfo),
      });

      // If a post was successfully published or scheduled, fire confetti
      if (dualAgentResponse.actionCard?.type === 'post_preview' && dualAgentResponse.actionCard?.status !== 'failed') {
        try {
          confetti({
            particleCount: 35,
            spread: 55,
            origin: { y: 0.8 },
            colors: ['#6366f1', '#10b981', '#ffffff']
          });
        } catch {
          // ignore
        }
      }

      const assistantMessageId = 'msg_asst_' + Date.now();
      const assistantMessage = {
        id: assistantMessageId,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: dualAgentResponse.content,
        dualAgentTrace: dualAgentResponse.dualAgentTrace,
        actionCard: dualAgentResponse.actionCard,
      };

      onUpdateConversation({
        ...activeConversation,
        title: activeConversation.title === 'New Conversation'
          ? (text.slice(0, 32) + (text.length > 32 ? '...' : ''))
          : activeConversation.title,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date().toISOString(),
      });

    } catch (err) {
      console.error('Dual agent execution failed:', err);
      const errorMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: `⚠️ Encountered an error: ${err.message}. Please check your connection or settings.`,
      };
      onUpdateConversation({
        ...activeConversation,
        messages: [...updatedMessages, errorMessage],
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
      setCurrentStepInfo(null);
    }
  };

  const handleClearMessages = () => {
    if (!activeConversation) return;
    if (window.confirm('Clear all messages in this conversation?')) {
      onUpdateConversation({
        ...activeConversation,
        messages: [],
      });
    }
  };

  const formatModelName = (modelId) => {
    if (!modelId || modelId === 'openrouter/free') return 'Free Models Router';
    const parts = modelId.split('/');
    const namePart = (parts[1] || parts[0]).replace(':free', '');
    return namePart
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const activeModelDisplay = formatModelName(settings.agentModel);

  const quickPromptTemplates = [
    {
      title: "Check Connected Accounts",
      icon: Share2,
      prompt: "Which accounts are currently connected to SocialFlow?",
    },
    {
      title: "Schedule Launch Post",
      icon: Calendar,
      prompt: "Schedule a product update post for tomorrow at 10:00 AM on our connected channels.",
    },
    {
      title: "Check Engagement & Reach",
      icon: BarChart3,
      prompt: "Give me an overview of our 30-day reach and follower growth from Zenrio.",
    },
    {
      title: "Moderate Inbound Inquiries",
      icon: CheckCircle2,
      prompt: "Check recent comments and draft replies answering questions about our platform.",
    }
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-transparent overflow-hidden font-sans">
      
      {/* Sidebar - Conversation List */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onNewConversation={onNewConversation}
        onDeleteConversation={onDeleteConversation}
        onRenameConversation={onRenameConversation}
        accountsCount={accounts.length}
        onOpenSettings={onOpenSettings}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Window Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Chat Window Header */}
        <div className="h-11 border-b border-zinc-800/60 bg-[#09090b]/70 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between z-10 shrink-0">
          
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-medium text-xs text-zinc-200 truncate max-w-xs sm:max-w-md">
              {activeConversation?.title || 'SocialFlow AI'}
            </h2>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">
              • {activeModelDisplay}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={onOpenAccounts}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                accounts.length > 0
                  ? 'hover:bg-zinc-800/70 text-zinc-300 bg-zinc-900/50 border border-zinc-800/80'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              }`}
              title="View connected social channels"
            >
              <Share2 className="w-3 h-3" />
              <span>{accounts.length > 0 ? `${accounts.length} Channels` : 'No Channels'}</span>
            </button>

            {activeConversation?.messages?.length > 0 && (
              <button
                onClick={handleClearMessages}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/70 transition-colors"
                title="Clear Messages"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/70 transition-colors"
              title="Configure API Keys & Models"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Account Disconnected Warning Banner (if 0 accounts connected) */}
        {accounts.length === 0 && (
          <div className="bg-amber-950/30 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>No social accounts connected. Connect your Zenrio API key to enable live publishing and scheduling.</span>
            </div>
            <button
              onClick={onOpenAccounts}
              className="underline font-semibold hover:text-amber-200 shrink-0 ml-2"
            >
              Connect Now
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-2">
          
          {/* Empty Conversation Welcome State */}
          {(!activeConversation?.messages || activeConversation.messages.length === 0) ? (
            <div className="max-w-2xl mx-auto py-10 text-center space-y-6 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[1px] mx-auto shadow-xl shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  How can SocialFlow AI assist your social media today?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                  {accounts.length > 0 ? (
                    <>I can schedule posts, draft copy, manage comments, and check analytics across your <strong>{accounts.length} connected Zenrio channel{accounts.length > 1 ? 's' : ''}</strong>.</>
                  ) : (
                    <>Ask me anything or query connected accounts. Connect your Zenrio API key in <strong>Accounts</strong> to unlock full cross-platform publishing.</>
                  )}
                </p>
              </div>

              {/* Quick Prompt Template Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                {quickPromptTemplates.map((template, idx) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage({ text: template.prompt, accountIds: accounts.map(a => a.id) })}
                      className="p-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-850/80 border border-zinc-800/80 hover:border-zinc-700 text-xs transition-all group space-y-1.5"
                    >
                      <div className="flex items-center gap-2 text-zinc-200 font-semibold group-hover:text-white">
                        <Icon className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span>{template.title}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">
                        "{template.prompt}"
                      </p>
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full">
              {activeConversation.messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                />
              ))}

              {/* Live Responding Animation when AI Agent is actively processing */}
              {isLoading && (
                <AgentThinkingBubble
                  currentStepInfo={currentStepInfo}
                  activeModelName={activeModelDisplay}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* Floating Chat Input Bar */}
        <div className="shrink-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent pt-2">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentStepInfo={currentStepInfo}
            accounts={accounts}
            activeModelName={activeModelDisplay}
          />
        </div>

      </div>

    </div>
  );
}
