/**
 * contextResolver.js
 * Pure utility — no side effects, no imports.
 *
 * Responsibilities:
 *  1. Extract a numbered / ordinal suggestion selection ("3rd one", "the second",
 *     "last option", "choose the first") from the user's raw text.
 *  2. Resolve it against the suggestion list embedded in the immediately preceding
 *     assistant message of the SAME conversation.
 *  3. Detect follow-up editing intents ("make it shorter", "explain more",
 *     "use the same account", "rephrase", etc.) and append the prior context so the
 *     AI can act on it.
 *  4. Return a ResolvedContext object that ChatPage hands to the dual-agent pipeline.
 *
 * All functions are stateless and accept the messages array of the active
 * conversation so isolation between conversations is automatic.
 */

// ---------------------------------------------------------------------------
// Ordinal word → zero-based index map
// ---------------------------------------------------------------------------
const ORDINAL_MAP = {
  first: 0, '1st': 0, one: 0, '1': 0,
  second: 1, '2nd': 1, two: 1, '2': 1,
  third: 2, '3rd': 2, three: 2, '3': 2,
  fourth: 3, '4th': 3, four: 3, '4': 3,
  fifth: 4, '5th': 4, five: 4, '5': 4,
  sixth: 5, '6th': 5, six: 5, '6': 5,
  last: -1,   // resolved dynamically against list length
  latest: -1,
};

// Regex that matches ordinal references in natural language
const ORDINAL_RE = /\b(first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th|one|two|three|four|five|six|last|latest|[1-6])\b/i;

// Phrases that signal a selection from a numbered list
const SELECTION_TRIGGERS = [
  /\bgo with\b/i,
  /\bchoose\b/i,
  /\bselect\b/i,
  /\bpick\b/i,
  /\buse\s+(the\s+)?(first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th|last)\b/i,
  /\b(that|the)\s+(first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th|last)\s+(one|option|suggestion|idea|version|draft)\b/i,
  /\b(first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th|last)\s+(one|option|suggestion|idea|version|draft)\b/i,
  /^(first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th|last)[\s.!,]?$/i,
  /^[1-6][\s.!,]?$/,
];

// Follow-up editing keywords
const FOLLOWUP_TRIGGERS = [
  /\bmake\s+it\s+(shorter|longer|funnier|punchier|formal|casual|concise|detailed)\b/i,
  /\bmore\s+(detail|explanation|context|examples|formal|casual|professional)\b/i,
  /\bexplain\s+(more|further|that|again)\b/i,
  /\brephrase\b/i,
  /\brewrite\b/i,
  /\bsimplify\b/i,
  /\bexpand\b/i,
  /\bshorten\b/i,
  /\bsame\s+account\b/i,
  /\buse\s+the\s+same\b/i,
  /\bdo\s+(that|it)\s+again\b/i,
  /\btry\s+again\b/i,
  /\badd\s+a\s+hashtag\b/i,
  /\badd\s+emoji\b/i,
  /\btranslate\b/i,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract numbered suggestion items from assistant message content.
 * Recognises lines like:
 *   "1. Some caption text"
 *   "1) Some caption"
 *   "**1.** Some caption"
 *   "Option 1: Some caption"
 *
 * Returns an array of strings (the suggestion texts), or [] if none found.
 */
function extractSuggestionsFromText(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const results = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match "1.", "1)", "**1.**", "Option 1:" etc.
    const m = trimmed.match(/^(?:\*{0,2}(?:Option\s+)?(\d+)[.):\s]\*{0,2})\s*(.+)$/i);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      if (idx >= 0 && idx < 10) {
        results[idx] = m[2].replace(/\*{1,2}/g, '').trim();
      }
    }
  }

  // Remove holes and return only the dense prefix
  return results.filter(Boolean);
}

/**
 * Walk backwards through messages to find the last assistant message
 * that contains an embedded numbered list.
 * Returns { suggestions: string[], messageContent: string } or null.
 */
function findLastSuggestionBlock(messages) {
  if (!messages || messages.length === 0) return null;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.sender !== 'assistant') continue;
    const suggestions = extractSuggestionsFromText(msg.content);
    if (suggestions.length >= 2) {
      return { suggestions, messageContent: msg.content };
    }
  }
  return null;
}

/**
 * Find the last assistant message (regardless of whether it has a list).
 */
function findLastAssistantMessage(messages) {
  if (!messages || messages.length === 0) return null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender === 'assistant') return messages[i];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Detect whether rawText is an ordinal selection (e.g. "3rd one", "second").
 *
 * @param {string} rawText
 * @returns {{ isOrdinal: boolean, index: number|null }}
 */
export function detectOrdinalSelection(rawText) {
  const lower = rawText.trim().toLowerCase();

  const hasSelectionTrigger = SELECTION_TRIGGERS.some(re => re.test(lower));
  const ordinalMatch = lower.match(ORDINAL_RE);

  if (!ordinalMatch && !hasSelectionTrigger) {
    return { isOrdinal: false, index: null };
  }

  if (ordinalMatch) {
    const key = ordinalMatch[1].toLowerCase();
    const idx = ORDINAL_MAP[key];
    if (idx !== undefined) {
      return { isOrdinal: true, index: idx }; // -1 means "last"
    }
  }

  return { isOrdinal: false, index: null };
}

/**
 * Detect whether rawText is a follow-up edit request.
 *
 * @param {string} rawText
 * @returns {boolean}
 */
export function isFollowUpEdit(rawText) {
  const lower = rawText.trim().toLowerCase();
  return FOLLOWUP_TRIGGERS.some(re => re.test(lower));
}

/**
 * Main entry point called by ChatPage before every send.
 *
 * @param {string} rawText         – What the user typed
 * @param {Array}  messages        – Messages of the ACTIVE conversation only
 * @returns {ResolvedContext}
 *
 * ResolvedContext shape:
 * {
 *   resolvedText: string,   // Text to actually send to the AI pipeline
 *   wasResolved: boolean,   // true if rawText was rewritten
 *   resolutionLabel: string,// Human-readable note for the UI (optional)
 *   needsClarification: boolean, // true if we should ask the user to clarify
 *   clarificationPrompt: string, // Message to show if needsClarification
 * }
 */
export function resolveContext(rawText, messages) {
  const raw = rawText.trim();

  // --- 1. Ordinal selection ---
  const { isOrdinal, index } = detectOrdinalSelection(raw);

  if (isOrdinal) {
    const block = findLastSuggestionBlock(messages);

    if (!block) {
      // Ordinal used but no prior suggestion list exists in this conversation
      return {
        resolvedText: raw,
        wasResolved: false,
        resolutionLabel: null,
        needsClarification: true,
        clarificationPrompt:
          "I don't have a numbered list of suggestions in our current conversation to pick from. Could you tell me more specifically what you'd like to do?",
      };
    }

    const { suggestions } = block;
    const resolvedIndex = index === -1 ? suggestions.length - 1 : index;

    if (resolvedIndex < 0 || resolvedIndex >= suggestions.length) {
      return {
        resolvedText: raw,
        wasResolved: false,
        resolutionLabel: null,
        needsClarification: true,
        clarificationPrompt: `I only have ${suggestions.length} option${suggestions.length > 1 ? 's' : ''} in my previous reply. Which one did you mean?`,
      };
    }

    const chosen = suggestions[resolvedIndex];
    const resolvedText = `Use this exact content for the action I requested earlier: "${chosen}"`;

    return {
      resolvedText,
      wasResolved: true,
      resolutionLabel: `Resolved "${raw}" → suggestion ${resolvedIndex + 1}: "${chosen.slice(0, 60)}${chosen.length > 60 ? '…' : ''}"`,
      needsClarification: false,
      clarificationPrompt: null,
    };
  }

  // --- 2. Follow-up edit ---
  if (isFollowUpEdit(raw)) {
    const lastAsst = findLastAssistantMessage(messages);

    if (!lastAsst) {
      // Nothing to follow up on
      return {
        resolvedText: raw,
        wasResolved: false,
        resolutionLabel: null,
        needsClarification: false,
        clarificationPrompt: null,
      };
    }

    // Append last assistant content as context so the AI can apply the edit
    const priorContent = lastAsst.content.slice(0, 600); // cap context size
    const resolvedText = `Follow-up edit request — apply this instruction: "${raw}".\n\nPrevious content to edit:\n"""\n${priorContent}\n"""`;

    return {
      resolvedText,
      wasResolved: true,
      resolutionLabel: `Follow-up edit: "${raw}"`,
      needsClarification: false,
      clarificationPrompt: null,
    };
  }

  // --- 3. No special context needed — pass through unchanged ---
  return {
    resolvedText: raw,
    wasResolved: false,
    resolutionLabel: null,
    needsClarification: false,
    clarificationPrompt: null,
  };
}
