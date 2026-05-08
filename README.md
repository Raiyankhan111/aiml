# Real-Time ISS & News Dashboard

A production-ready React + Vite web application displaying real-time ISS tracking data, a news dashboard, and an AI Chatbot using Hugging Face Inference API.

## Features
- **Real-Time ISS Tracking**: Polls open-notify API every 15s. Calculates speed using the Haversine formula and displays trajectory on an interactive Leaflet map.
- **News Dashboard**: Fetches recent articles from NewsAPI, filters by category, caches in LocalStorage with 15-minute expiry.
- **AI Chatbot**: Context-aware AI powered by `deepseek-ai/DeepSeek-V4-Flash:novita` via Hugging Face Router and OpenAI SDK.
- **Visualizations**: Live speed line chart using Recharts.
- **UI/UX**: Tailwind CSS v4 styling, fully responsive, dark/light mode toggle.

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your `VITE_NEWS_API_KEY` and `VITE_AI_TOKEN`.

3. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- React 18, Vite
- Tailwind CSS v4
- Leaflet & React-Leaflet
- Recharts
- Axios & OpenAI Node SDK
- Lucide React

## Deployment
This application is ready to be deployed on Vercel. Connect your repository, ensure environment variables are set in Vercel settings, and the build command `npm run build` will create the production bundle.
