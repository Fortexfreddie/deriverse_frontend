# Deriverse Trading Cockpit (Frontend)

## Reviewer Quick Start
- **Primary View**: `src/app/page.tsx` (Institutional Dashboard)
- **Data Orchestration**: `src/hooks/useDashboardData.ts` (Unified Hook)
- **Animation System**: `src/app/journal/page.tsx` (Framer Motion Staggering)
- **Live Sync**: `src/components/WalletSyncLoader.tsx` (Bootloader Aesthetic)

> **An institutional-grade trading dashboard for the Deriverse protocol, featuring real-time analytics, AI insights, and high-fidelity trade journaling.**

This project is the frontend for the [Deriverse Trading Analytics](https://github.com/Fortexfreddie/deriverse_backend/blob/main/README.md) ecosystem. It provides a "War Room" aesthetic for Solana traders, transforming raw on-chain data into actionable institutional insights.

---

## Project Aim

The goal of this frontend is to provide:
1.  **Low-Latency Performance**: Rapid visualization of realized/unrealized PnL via optimized TanStack Query caching and unified data hooks.
2.  **Institutional Aesthetics**: A premium, "million-dollar" UI utilizing dark modes, glassmorphism, and micro-animations to drive user engagement.
3.  **Behavioral Visualization**: Transforming AI-driven psychology audits (from backend) into interactive "Trade Dossiers" and archetypal visualizations.
4.  **Seamless Wallet Sync**: A high-touch "Bootloader" experience that handles the transition from sandbox/demo mode to live on-chain data.

---

## Architecture

The frontend follows a modern **App Router** architecture with atomic components and centralized data hooks:

```mermaid
graph TD
    User["Trader (User)"] -->|Connect Wallet| Auth["Solana Wallet Provider"]
    Auth -->|Triggers Sync| SyncUI["WalletSyncLoader (UI)"]
    SyncUI -->|API Request| Backend["Deriverse Backend /api/sync"]
    
    subgraph Frontend Logic
        Hook_Dashboard["useDashboardData"]
        Hook_Analytics["useAnalytics"]
        Hook_Journal["useJournalData"]
        
        API_Client["lib/api.ts (Axios)"]
    end
    
    Hook_Dashboard --> API_Client
    Hook_Analytics --> API_Client
    Hook_Journal --> API_Client
    
    API_Client -->|Live Data| Backend
    
    subgraph UI Layers
        Page_Dashboard["Dashboard /"]
        Page_Analytics["Analytics /analytics"]
        Page_Journal["Journal /journal"]
        Page_History["History /history"]
    end
    
    Hook_Dashboard --> Page_Dashboard
    Hook_Analytics --> Page_Analytics
    Hook_Journal --> Page_Journal
```

### Core Components
-   **Dashboard (War Room)**: Aggregates KPI cards, PnL charts, and live engine logs into a single high-density view.
-   **Analytics Studio**: Visualizes complex risk metrics (Sharpe, Sortino, Drawdown) using Recharts and interactive heatmaps.
-   **Interactive Journal**: A specialized interface for trade annotation, AI-coaching "nudges", and behavioral pattern tracking.
-   **Audit Stream**: A terminal-style log of system events and execution data, providing a real-time "Pulse" of the trading account.

---

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
-   **Logic**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with Custom Design Tokens
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Staggered variants, spring transitions)
-   **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) (Caching, Auto-refetching)
-   **Charts**: [Recharts](https://recharts.org/) (Customized for institutional dark-mode aesthetics)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Blockchain**: [@solana/wallet-adapter](https://solana.com/) (Multi-wallet support)

---

## Getting Started

### Prerequisites
-   **Node.js** >= 18.x
-   **pnpm** (preferred) or npm
-   **Deriverse Backend** running locally or accessible via URL

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Fortexfreddie/deriverse_frontend
cd deriverse-cockpit-3
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_SOLANA_RPC="https://api.devnet.solana.com"
```

### 3. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## Key Workflows

### 1. Wallet Synchronization
When a user connects their wallet, the app detects if the wallet data is cached on the backend. If not, it triggers the `WalletSyncLoader`—a terminal-inspired experience that provides feedback as the backend decodes blockchain logs and calculates historical performance.

### 2. Hybrid Demo Mode
The app features a robust "Sandbox" state. If no wallet is connected, it falls back to high-fidelity mock data, allowing users to explore the dashboard's features (Analytics, Journal, History) before committing their on-chain data.

### 3. AI-Powered Journaling
In the Journal page, traders can annotate their performance. The frontend sends these notes to the backend, which correlates them with market sentiment and execution metrics to produce an "AI Nudge"—detecting biases like FOMO or Revenge Trading and visualizing them with dynamic archetypes.

---

## External Resources

-   **Backend Repository**: [Deriverse Trading Analytics Backend](https://github.com/Fortexfreddie/deriverse_backend/blob/main/README.md)
-   **API Documentation**: `http://localhost:5000/api-docs` (Swagger)

---

## License

[ISC](LICENSE)
