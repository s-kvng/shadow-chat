# Shadow Chat

Shadow Chat is a simple web-based chat application built with Next.js that interacts with an AI model via the Groq API. It features a clean interface for sending prompts and displaying responses, including intermediate "thinking" steps from the AI.

## Features

*   Simple, responsive chat interface built with React and Tailwind CSS.
*   Sends user prompts to a backend API endpoint.
*   Connects to the Groq API for fast AI responses.
*   Displays both the AI's thinking process (if provided) and the final response.
*   Uses Markdown rendering for formatted AI responses.
*   Utilizes the Geist font for typography.

## Streaming Version

A version of this application implementing streaming responses is available on the streaming branch.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) 15+ (with App Router & Turbopack)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [React](https://react.dev/) 19
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) 4
*   **AI Integration:** [Groq API](https://groq.com/) via `openai` SDK
*   **Markdown Rendering:** `react-markdown`

## Getting Started

### Prerequisites

*   Node.js (Version recommended by Next.js 15+)
*   npm, yarn, pnpm, or bun
*   A Groq API Key

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd shadow-chat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Groq API key:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```
    *Note: `.env.local` is included in `.gitignore` by default.*

### Running the Development Server

Run the development server using Turbopack (recommended):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
