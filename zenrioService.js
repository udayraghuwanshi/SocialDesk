// Zenrio (Zernio) API Service
// Official API docs: https://docs.zernio.com
// Base endpoint: https://zernio.com/api/v1

const BASE_URL = 'https://zernio.com/api/v1';

export const PLATFORM_CONFIGS = {
  x: { name: 'X (Twitter)', color: '#1DA1F2' },
  twitter: { name: 'X (Twitter)', color: '#1DA1F2' },
  linkedin: { name: 'LinkedIn', color: '#0A66C2' },
  instagram: { name: 'Instagram', color: '#E4405F' },
  facebook: { name: 'Facebook', color: '#1877F2' },
  threads: { name: 'Threads', color: '#000000' },
  youtube: { name: 'YouTube', color: '#FF0000' },
  tiktok: { name: 'TikTok', color: '#00F2FE' },
  bluesky: { name: 'Bluesky', color: '#0560FF' },
  pinterest: { name: 'Pinterest', color: '#BD081C' },
};

function formatPlatformName(platform) {
  const p = (platform || '').toLowerCase();
  return PLATFORM_CONFIGS[p]?.name || (platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Channel');
}

function getPlatformColor(platform) {
  const p = (platform || '').toLowerCase();
  return PLATFORM_CONFIGS[p]?.color || '#6366f1';
}

function createInitialsAvatar(name) {
  const clean = (name || 'SF').trim();
  const initial = clean.charAt(0).toUpperCase();
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="20" fill="%2327272a"/><text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="600" fill="%23e4e4e7" dominant-baseline="middle" text-anchor="middle">${initial}</text></svg>`;
}

export const zenrioService = {
  /**
   * Authenticate with Zenrio API and fetch real accounts & profile
   */
  authenticateAndFetchData: async (apiKey) => {
    const key = (apiKey || '').trim();
    if (!key) {
      return {
        success: false,
        error: 'Zenrio API key is empty. Please provide a valid API key from your Zenrio dashboard.'
      };
    }

    try {
      const response = await fetch(`${BASE_URL}/accounts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errDetail = '';
        try {
          const errJson = await response.json();
          errDetail = errJson.message || errJson.error || JSON.stringify(errJson);
        } catch {
          errDetail = response.statusText;
        }

        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: `Authentication failed (HTTP ${response.status}): The Zenrio API key is invalid or unauthorized.`,
          };
        }

        return {
          success: false,
          error: `Zenrio API request failed (HTTP ${response.status}): ${errDetail || 'Unable to fetch accounts'}`,
        };
      }

      const data = await response.json();
      const rawAccounts = Array.isArray(data)
        ? data
        : (data.accounts || data.data || []);

      const normalizedAccounts = rawAccounts.map((item, idx) => {
        const platform = (item.platform || item.network || 'x').toLowerCase();
        const displayName = item.name || item.displayName || item.username || `Account ${idx + 1}`;
        const rawHandle = item.handle || item.username || item.screen_name || displayName;
        const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;
        const followers = typeof item.followers === 'number'
          ? item.followers
          : typeof item.followersCount === 'number'
          ? item.followersCount
          : 0;

        return {
          id: String(item.id || item._id || `acc_${platform}_${idx}`),
          platform,
          platformName: formatPlatformName(platform),
          name: displayName,
          handle,
          avatar: item.avatar || item.avatarUrl || item.profileImageUrl || createInitialsAvatar(displayName),
          followers,
          engagementRate: item.engagementRate || '—',
          status: item.status || 'connected',
          connectedAt: item.connectedAt || item.createdAt || new Date().toISOString(),
          capabilities: Array.isArray(item.capabilities) && item.capabilities.length > 0
            ? item.capabilities
            : ['create_post', 'schedule_post', 'manage_comments', 'analytics'],
          color: getPlatformColor(platform),
        };
      });

      // Build real user profile from connected accounts
      let userProfile = null;
      if (normalizedAccounts.length > 0) {
        const primary = normalizedAccounts[0];
        userProfile = {
          name: primary.name,
          handle: primary.handle,
          email: primary.email || '',
          avatar: primary.avatar,
          role: `${primary.platformName} Account`,
          platformCount: normalizedAccounts.length,
          lastSyncedAt: new Date().toISOString(),
        };
      } else {
        userProfile = {
          name: 'Zenrio Account',
          handle: '@zenrio_user',
          avatar: createInitialsAvatar('Zenrio'),
          role: 'Connected API Key',
          platformCount: 0,
          lastSyncedAt: new Date().toISOString(),
        };
      }

      return {
        success: true,
        mode: 'live',
        accounts: normalizedAccounts,
        user: userProfile,
      };

    } catch (err) {
      return {
        success: false,
        error: `Network or CORS error connecting to Zenrio API: ${err.message || 'Failed to reach https://zernio.com'}. Please check your internet connection or verify your API key.`
      };
    }
  },

  /**
   * Test API Key validity
   */
  testConnection: async (apiKey) => {
    return await zenrioService.authenticateAndFetchData(apiKey);
  },

  /**
   * Fetch connected accounts from Zenrio
   */
  getAccounts: async (apiKey) => {
    return await zenrioService.authenticateAndFetchData(apiKey);
  },

  /**
   * Create or Schedule a Post
   * POST /v1/posts
   */
  createPost: async ({ apiKey, accounts = [], content, scheduledFor, timezone = 'UTC', mediaUrls = [], tags = [] }) => {
    const key = (apiKey || '').trim();
    if (!key) {
      return {
        success: false,
        error: 'No Zenrio API key provided. Please connect your Zenrio API key in Settings.'
      };
    }

    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: 'No destination accounts selected. Please specify at least one connected social account.'
      };
    }

    const isScheduled = !!scheduledFor;
    const payload = {
      accounts,
      content,
      scheduledFor: scheduledFor || null,
      timezone,
      mediaUrls,
      tags,
    };

    try {
      const res = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg = data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
        return {
          success: false,
          error: errorMsg,
          endpoint: 'POST https://zernio.com/api/v1/posts',
          statusCode: res.status,
        };
      }

      return {
        success: true,
        status: isScheduled ? 'scheduled' : 'published',
        endpoint: 'POST https://zernio.com/api/v1/posts',
        statusCode: res.status,
        postId: data.id || data.postId || `post_${Date.now()}`,
        data,
        payload,
      };

    } catch (err) {
      return {
        success: false,
        error: `Network error publishing via Zenrio API: ${err.message}`,
        endpoint: 'POST https://zernio.com/api/v1/posts',
      };
    }
  },

  /**
   * Reply to a Comment
   * POST /v1/comments/:id/reply
   */
  replyComment: async ({ apiKey, commentId, replyText, accountId }) => {
    const key = (apiKey || '').trim();
    if (!key) {
      return {
        success: false,
        error: 'Zenrio API key is not configured.'
      };
    }

    try {
      const res = await fetch(`${BASE_URL}/comments/${encodeURIComponent(commentId)}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replyText, accountId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${res.status}: ${res.statusText}`,
          endpoint: `POST https://zernio.com/api/v1/comments/${commentId}/reply`,
        };
      }

      return {
        success: true,
        data,
        endpoint: `POST https://zernio.com/api/v1/comments/${commentId}/reply`,
        statusCode: res.status,
      };
    } catch (err) {
      return {
        success: false,
        error: `Network error executing comment reply: ${err.message}`,
      };
    }
  },

  /**
   * Reply to a Direct Message / Conversation
   * POST /v1/inbox/conversations/:id/messages
   */
  replyDM: async ({ apiKey, conversationId, messageText, accountId }) => {
    const key = (apiKey || '').trim();
    if (!key) {
      return {
        success: false,
        error: 'Zenrio API key is not configured.'
      };
    }

    try {
      const res = await fetch(`${BASE_URL}/inbox/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText, accountId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${res.status}: ${res.statusText}`,
          endpoint: `POST https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`,
        };
      }

      return {
        success: true,
        data,
        endpoint: `POST https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`,
        statusCode: res.status,
      };
    } catch (err) {
      return {
        success: false,
        error: `Network error sending direct message: ${err.message}`,
      };
    }
  },

  /**
   * Fetch Social Performance Analytics
   * GET /v1/analytics
   */
  getAnalytics: async ({ apiKey, accountId, timeframe = '30d' }) => {
    const key = (apiKey || '').trim();
    if (!key) {
      return {
        success: false,
        error: 'Zenrio API key is not configured.'
      };
    }

    try {
      const res = await fetch(`${BASE_URL}/analytics?accountId=${encodeURIComponent(accountId || 'all')}&timeframe=${encodeURIComponent(timeframe)}`, {
        headers: { 'Authorization': `Bearer ${key}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${res.status}: ${res.statusText}`,
          endpoint: 'GET https://zernio.com/api/v1/analytics',
        };
      }

      return {
        success: true,
        data,
        endpoint: 'GET https://zernio.com/api/v1/analytics',
        statusCode: res.status,
      };
    } catch (err) {
      return {
        success: false,
        error: `Network error retrieving analytics: ${err.message}`,
      };
    }
  }
};
