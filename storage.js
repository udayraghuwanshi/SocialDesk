// LocalStorage Service for SocialFlow AI - 100% Frontend-Only Architecture

const STORAGE_KEYS = {
  SETTINGS: 'socialflow_settings',
  CONVERSATIONS: 'socialflow_conversations',
  ACCOUNTS: 'socialflow_accounts',
  SCHEDULED_POSTS: 'socialflow_scheduled_posts',
  USER_PROFILE: 'socialflow_user_profile',
};

// Automatic cleanup of legacy mock/dummy data (e.g. Alex Rivera, mock accounts)
(function purgeLegacyDummyData() {
  try {
    const rawProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (rawProfile && (rawProfile.includes('Alex Rivera') || rawProfile.includes('alex@socialflow.ai') || rawProfile.includes('acc_x_01'))) {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }

    const rawAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (rawAccounts && (rawAccounts.includes('acc_x_01') || rawAccounts.includes('@SocialFlowApp') || rawAccounts.includes('acc_li_02'))) {
      localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    }

    const rawConvs = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (rawConvs && (rawConvs.includes('conv_launch_campaign') || rawConvs.includes('zn_post_89142f9b'))) {
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    }
  } catch (err) {
    console.warn('Storage purge error:', err);
  }
})();

// Auto-migration of deprecated free models to verified active free models
const DEPRECATED_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free',
  'deepseek/deepseek-chat:free',
  'google/gemini-2.0-flash:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];

(function migrateDeprecatedModels() {
  try {
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (rawSettings) {
      const settings = JSON.parse(rawSettings);
      let modified = false;
      if (DEPRECATED_MODELS.includes(settings.agentModel)) {
        settings.agentModel = 'openrouter/free';
        modified = true;
      }
      if (DEPRECATED_MODELS.includes(settings.responseModel)) {
        settings.responseModel = 'openrouter/free';
        modified = true;
      }
      if (modified) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      }
    }
  } catch (err) {
    console.warn('Storage model migration error:', err);
  }
})();

export const DEFAULT_MODELS = [
  { id: 'openrouter/free', name: 'Free Models Router (Auto-selects active free LLM)', badge: 'Recommended' },
  { id: 'google/gemma-4-31b-it:free', name: 'Google: Gemma 4 31B (Free)', badge: 'High Quality' },
  { id: 'google/gemma-4-26b-a4b-it:free', name: 'Google: Gemma 4 26B A4B (Free)', badge: 'Fast Reasoning' },
  { id: 'nvidia/nemotron-3.5-lightning:free', name: 'NVIDIA: Nemotron 3.5 Lightning (Free)', badge: '1M Context' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'NVIDIA: Nemotron 3 Ultra 550B (Free)', badge: 'Powerful' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'NVIDIA: Nemotron 3 Super 120B (Free)', badge: 'Balanced' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', name: 'NVIDIA: Nemotron 3 Nano Omni (Free)', badge: 'Reasoning' },
  { id: 'cohere/north-mini-code:free', name: 'Cohere: North Mini Code (Free)', badge: 'Code & Tools' },
  { id: 'liquid/lfm-2.5-2.6b:free', name: 'LiquidAI: LFM 2.5 2.6B (Free)', badge: 'Lightweight' },
  { id: 'thinkingmachines/inkling:free', name: 'Thinking Machines: Inkling (Free)', badge: '1M Context' },
  { id: 'poolside/laguna-s-2.1:free', name: 'Poolside: Laguna S 2.1 (Free)', badge: 'Fast' },
];

export const DEFAULT_SETTINGS = {
  openRouterApiKey: '',
  agentModel: 'openrouter/free',
  responseModel: 'openrouter/free',
  customModel: '',
  zenrioApiKey: '',
  agentTone: 'growth_hacker',
  requireConfirmation: false,
  defaultTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  systemPromptAgent1: 'You are the Action Detection Agent for SocialFlow AI. Analyze user requests and extract structured Zenrio API tool actions.',
  systemPromptAgent2: 'You are the Response Agent for SocialFlow AI. Explain social media operations with clarity, charm, and strategic insights.',
};

// Storage Helpers
export const storage = {
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      if (DEPRECATED_MODELS.includes(parsed.agentModel)) {
        parsed.agentModel = 'openrouter/free';
      }
      if (DEPRECATED_MODELS.includes(parsed.responseModel)) {
        parsed.responseModel = 'openrouter/free';
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  },

  getAccounts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveAccounts: (accounts) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts || []));
    } catch (e) {
      console.error('Failed to save accounts to localStorage:', e);
    }
  },

  getConversations: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveConversations: (conversations) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations || []));
    } catch (e) {
      console.error('Failed to save conversations to localStorage:', e);
    }
  },

  getUserProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUserProfile: (user) => {
    try {
      if (!user) {
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      } else {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to save user to localStorage:', e);
    }
  },

  clearAllUserData: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
      localStorage.removeItem(STORAGE_KEYS.SCHEDULED_POSTS);
    } catch (e) {
      console.error('Failed to clear user data:', e);
    }
  },

  exportAllData: () => {
    const backup = {
      settings: storage.getSettings(),
      accounts: storage.getAccounts(),
      conversations: storage.getConversations(),
      user: storage.getUserProfile(),
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) storage.saveSettings(data.settings);
      if (data.accounts) storage.saveAccounts(data.accounts);
      if (data.conversations) storage.saveConversations(data.conversations);
      if (data.user) storage.saveUserProfile(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  resetDefaults: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.SCHEDULED_POSTS);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.error('Failed to reset defaults:', e);
    }
  }
};
