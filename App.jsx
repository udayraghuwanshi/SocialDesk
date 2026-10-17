import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import AccountsPage from './pages/AccountsPage';
import SettingsPage from './pages/SettingsPage';
import { LoginPage, SignUpPage } from './pages/AuthPages';
import AboutPage from './pages/AboutPage';
import { storage } from './services/storage';
import DarkGradientBg from './components/ui/DarkGradientBg';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [user, setUser] = useState(() => storage.getUserProfile());
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [accounts, setAccounts] = useState(() => storage.getAccounts());
  const [conversations, setConversations] = useState(() => storage.getConversations());
  const [activeConversationId, setActiveConversationId] = useState(() => {
    const convs = storage.getConversations();
    return convs[0]?.id || null;
  });

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K for New Chat)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewConversation();
        setActivePage('chat');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [conversations]);

  // Sync state changes with localStorage
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleUpdateAccounts = (newAccounts) => {
    setAccounts(newAccounts);
    storage.saveAccounts(newAccounts);

    // If all accounts were removed, clear the connected user profile
    if (!newAccounts || newAccounts.length === 0) {
      setUser(null);
      storage.saveUserProfile(null);
    } else if (!user && newAccounts.length > 0) {
      const primary = newAccounts[0];
      const newUser = {
        name: primary.name,
        handle: primary.handle,
        email: primary.email || '',
        avatar: primary.avatar,
        role: `${primary.platformName} Account`,
        platformCount: newAccounts.length,
        lastSyncedAt: new Date().toISOString(),
      };
      setUser(newUser);
      storage.saveUserProfile(newUser);
    }
  };

  // Called when user connects via Zenrio credentials
  const handleConnectZenrio = ({ apiKey, accounts: newAccounts, user: newUser }) => {
    if (apiKey) {
      const updatedSettings = { ...settings, zenrioApiKey: apiKey };
      setSettings(updatedSettings);
      storage.saveSettings(updatedSettings);
    }

    setAccounts(newAccounts || []);
    storage.saveAccounts(newAccounts || []);

    setUser(newUser || null);
    storage.saveUserProfile(newUser || null);
  };

  // Completely disconnect all accounts & clear user data
  const handleDisconnectAll = () => {
    storage.clearAllUserData();
    setUser(null);
    setAccounts([]);
    setConversations([]);
    setActiveConversationId(null);
  };

  const handleUpdateConversation = (updatedConv) => {
    const updated = conversations.map(c => c.id === updatedConv.id ? updatedConv : c);
    setConversations(updated);
    storage.saveConversations(updated);
  };

  const handleNewConversation = (initialTitle) => {
    const newConvId = 'conv_' + Date.now();
    const newConv = {
      id: newConvId,
      title: initialTitle || 'New Conversation',
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    storage.saveConversations(updated);
    setActiveConversationId(newConvId);
    setActivePage('chat');
  };

  const handleStartChatWithPrompt = (initialPrompt) => {
    if (initialPrompt && typeof initialPrompt === 'string' && initialPrompt.trim()) {
      handleNewConversation(initialPrompt.trim().slice(0, 32));
    } else {
      setActivePage('chat');
    }
  };

  const handleDeleteConversation = (convId) => {
    const updated = conversations.filter(c => c.id !== convId);
    setConversations(updated);
    storage.saveConversations(updated);
    if (activeConversationId === convId) {
      setActiveConversationId(updated[0]?.id || null);
    }
  };

  const handleRenameConversation = (convId, newTitle) => {
    const updated = conversations.map(c => c.id === convId ? { ...c, title: newTitle } : c);
    setConversations(updated);
    storage.saveConversations(updated);
  };

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile);
    storage.saveUserProfile(userProfile);
    setActivePage('chat');
  };

  const handleLogout = () => {
    setUser(null);
    storage.saveUserProfile(null);
    setActivePage('landing');
  };

  const handleResetAll = () => {
    storage.resetDefaults();
    setUser(null);
    setSettings(storage.getSettings());
    setAccounts([]);
    setConversations([]);
    setActiveConversationId(null);
    setActivePage('landing');
  };

  return (
    <DarkGradientBg className="text-zinc-100 font-sans antialiased selection:bg-indigo-500/20 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
        onDisconnectAll={handleDisconnectAll}
        accountsCount={accounts.length}
      />

      {/* Main Page Router */}
      <main className="flex-1 flex flex-col">
        {activePage === 'landing' && (
          <LandingPage
            onStartChat={handleStartChatWithPrompt}
            onOpenAccounts={() => setActivePage('accounts')}
            onOpenSettings={() => setActivePage('settings')}
            onOpenAbout={() => setActivePage('about')}
            accountsCount={accounts.length}
            hasUser={!!user}
          />
        )}

        {activePage === 'chat' && (
          <ChatPage
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => setActiveConversationId(id)}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
            onUpdateConversation={handleUpdateConversation}
            accounts={accounts}
            settings={settings}
            onOpenSettings={() => setActivePage('settings')}
            onOpenAccounts={() => setActivePage('accounts')}
          />
        )}

        {activePage === 'accounts' && (
          <AccountsPage
            accounts={accounts}
            onUpdateAccounts={handleUpdateAccounts}
            onConnectZenrio={handleConnectZenrio}
            onDisconnectAll={handleDisconnectAll}
            settings={settings}
            user={user}
            onOpenSettings={() => setActivePage('settings')}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            settings={settings}
            accounts={accounts}
            user={user}
            onSaveSettings={handleSaveSettings}
            onConnectZenrio={handleConnectZenrio}
            onDisconnectAll={handleDisconnectAll}
            onResetAll={handleResetAll}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setActivePage('signup')}
            onOpenAccounts={() => setActivePage('accounts')}
          />
        )}

        {activePage === 'signup' && (
          <SignUpPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setActivePage('login')}
            onOpenAccounts={() => setActivePage('accounts')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            onStartChat={() => setActivePage('chat')}
            onOpenSettings={() => setActivePage('settings')}
          />
        )}
      </main>
    </DarkGradientBg>
  );
}
