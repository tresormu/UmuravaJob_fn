# Umurava Job Frontend - AI Talent Screening Tool

Welcome to the Umurava Job Frontend repository. This project is built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit**. It focuses on providing a recruiter-facing interface for AI-powered talent profile screening.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (RTK)
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel (Recommended)


## 🏗️ Folder Structure

We follow a **Feature-Based Modular Architecture**. This approach keeps related code together, making the application scalable and easy to maintain.

```
src/
├── app/              # Next.js App Router (Pages, Layouts, API routes)
├── assets/           # Static assets (Images, Icons, SVG, Fonts)
├── components/       # Global Shared Components
│   ├── ui/           # Atomic UI primitives (Buttons, Inputs, etc. - e.g., Shadcn)
│   ├── layout/       # Structural components (Header, Footer, Sidebar)
│   └── common/       # Business-generic shared components
├── features/         # Feature-specific modules (Modular logic)
│   ├── auth/         # Login, Register, Profile management
│   ├── jobs/         # Job listings, job creation, job details
│   └── applicants/   # Screening, ranking, shortlists
├── hooks/            # Global reusable React hooks
├── services/         # Global API client and shared data fetching logic
├── store/            # Global state management configuration (Redux Store)
├── types/            # Global TypeScript interfaces and types
└── utils/            # Helper functions, formatters, and constants
```

---

## 🛠️ Development Guidelines

### 1. Where to put your code?

- **A new page?** Add it in `src/app/`. Use folders for routing (e.g., `src/app/jobs/page.tsx`).
- **A generic button or modal?** Put it in `src/components/ui/`.
- **A job-specific component?** (e.g., `JobCard`, `ApplicantList`). Put it inside the corresponding feature: `src/features/jobs/components/`.
- **A custom hook?**
    - If it's globally useful: `src/hooks/`.
    - If it's only for one feature: `src/features/<feature-name>/hooks/`.

### 2. Feature-Based Architecture

Each folder in `src/features/` should ideally follow this internal structure:
```
features/my-feature/
├── components/       # Feature-specific components
├── hooks/            # Feature-specific hooks
├── services/         # Feature-specific API calls
├── store/            # Feature-specific Redux slices
├── types/            # Feature-specific TypeScript types
└── index.ts          # Public API for the feature (export what's needed)
```

### 3. State Management
- We use **Redux Toolkit** for global state.
- Create slices within `src/features/<feature>/store/` and register them in the main store at `src/store/index.ts`.

### 4. Components & Styling
- **Tailwind CSS** is our primary styling tool.
- Use **Utility-first** classes. Avoid creating custom CSS files unless absolutely necessary (use `globals.css` for base styles).
- Follow the **Atomic Design** principles for components in `src/components/ui`.

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=your_backend_api_url_here
```

## 🤖 AI Decision Flow

The application leverages the **Gemini API** to automate the screening process:
1. **Data Ingestion**: Job requirements and applicant profiles are sent to the AI Layer.
2. **Analysis**: Gemini parses the unstructured data and compares it against the job's weighted criteria (skills, experience, relevance).
3. **Scoring & Ranking**: Candidates are assigned a match score (0-100) and ranked.
4. **Reasoning**: Natural-language explanations are generated for each shortlist recommendation, highlighting strengths and gaps.

## ⚠️ Assumptions and Limitations

- **Data Format**: Assumes applicant profiles follow the provided Umurava Talent Schema.
- **Parsing**: Resume parsing accuracy depends on the quality and formatting of the uploaded PDF/CSV files.
- **AI Latency**: Screening speed is subject to Gemini API rate limits and response times.

## 📝 Coding Standards
- Use **TypeScript** for everything. Avoid `any`.
- Use **Functional Components** with Arrow functions.
- Follow **ESLint** and **Prettier** rules (configured in the repo).
- Prefix interfaces with `I` or use clear naming (e.g., `UserType`).

---

## ✉️ Contact
For architectural questions, please contact the Lead Frontend Engineer.
