# SocialDeck — AI-Powered Social Media Management

SocialDeck is a conversational social media management platform designed to simplify social media workflows through an AI-powered interface. It combines a React-based dashboard with OpenRouter for AI-assisted intent detection and response generation, and the Zernio API for social account integration and supported social media operations.

## ✨ Features

- **AI-Powered Chat Interface:** Interact with the platform using natural-language instructions.
- **Dual-Agent Workflow:** Uses one agent to interpret user requests and another to generate user-facing responses.
- **Social Account Management:** Connect and synchronize supported social media accounts through the Zernio API.
- **Post Publishing & Scheduling:** Submit post publishing and scheduling requests through the integrated API.
- **Messaging & Comment Replies:** Supports API workflows for direct messages and comment replies.
- **Analytics Requests:** Request social media performance analytics through the integrated API.
- **Conversation Management:** Maintain multiple conversations, rename or delete chats, and continue previous discussions.
- **Context-Aware Follow-Ups:** Resolve numbered suggestions and apply follow-up instructions using previous conversation context.
- **Configurable AI Models:** Configure available OpenRouter models and test API connectivity.
- **Local Data Persistence:** Store application settings, connected account data, conversations, and profile information in browser LocalStorage.
- **Data Import & Export:** Export and restore supported application data.
- **Responsive Interface:** Access the dashboard on desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend:** React.js, JavaScript, HTML5, CSS3
- **Styling:** Tailwind CSS
- **AI Integration:** OpenRouter API
- **Social Media Integration:** Zernio API
- **Icons & UI:** Lucide React
- **Animations:** Framer Motion
- **Build Tool:** Vite
- **Data Persistence:** Browser LocalStorage

## 🔑 API Configuration

Configure your API credentials through the application's Settings or Accounts interface.

- **OpenRouter API:** Enables live AI model requests, intent analysis, and response generation.
- **Zernio API:** Enables supported account synchronization and social media operations.

The application also includes client-side fallback logic for AI intent classification and response generation when live AI requests are unavailable.

**Important:** Live API operations require valid credentials, supported accounts, and successful API responses. Features may be limited by API permissions, service availability, or account capabilities.

## 💾 Data Storage

SocialDeck uses browser LocalStorage to persist application settings, conversations, account information, and user profile data.

This is a frontend-focused architecture; application data stored in LocalStorage is specific to the browser and device. It does not provide server-side synchronization across devices.

## 🔒 Security Notes

- Do not commit API keys, passwords, or other secrets to GitHub.
- Configure credentials through the application's settings interface.
- LocalStorage is browser-side storage and should not be treated as secure storage for sensitive credentials.
- Use the application only with social accounts you are authorized to manage.

## 📁 Project Structure

```text
SocialDeck/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   ├── openrouterService.js
│   │   ├── zenrioService.js
│   │   ├── contextResolver.js
│   │   └── storage.js
│   ├── App.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

*Note: The structure above is illustrative. Adjust it to match the actual files and folders in your repository.*

## 🚀 Future Improvements

- Add automated tests for AI intent detection and API workflows.
- Improve error handling and API response validation.
- Add stronger credential protection through a secure backend.
- Expand analytics visualizations and social account insights.
- Improve accessibility and user experience across devices.

---

*SocialDeck is a portfolio project exploring conversational AI, frontend application architecture, API integration, and social media workflow automation.*
