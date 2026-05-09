# BBMh Content OS — Master Repository

Welcome to the central strategic hub for BeanBag Media House. This repository manages the Content Bank, Master Planner, and Social Integration engine.

## 🚀 Deployment Pipeline

This project is deployed on **Vercel** and synchronized with **GitHub**. To ensure stability and live site integrity, we follow a strict branching workflow.

### The Two-Branch Strategy
1. **`main`**: The Production Branch. Any code pushed or merged here goes **LIVE** immediately to [bbmh-content-bank.vercel.app](https://bbmh-content-bank.vercel.app).
2. **`dev`**: The Development Branch. This is where all active building, fixing, and experimentation happens.

### How to Go Live
When a feature is ready on `dev` and tested on localhost:
1. Switch to main: `git checkout main`
2. Merge dev: `git merge dev`
3. Push to GitHub: `git push origin main`

## 🔑 Environment Configuration

The following variables MUST be set in the Vercel Dashboard (**Settings > Environment Variables**) for the app to function:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Public API Key |

## 🛠 Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Database/Auth**: Supabase
- **Icons**: Lucide React

