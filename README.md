# StudyOS — AI Powered Study Companion (React Project)

---

## 1. Product Title
**StudyOS — The AI-Powered Study Orchestrator**

---

## 2. Problem Statement
Students often struggle to manage their study schedules, organize topics, track learning progress, and revise effectively before exams. Study materials are usually scattered across notebooks, PDFs, and various apps. As exams approach, students often realize they have:

* **No tracking**: They haven't tracked what they studied.
* **Knowledge Gaps**: Important topics are forgotten.
* **Unstructured Review**: No structured revision plan exists.
* **Blind Spots**: No visibility into weak areas.

**StudyOS** solves this by providing a unified, intelligent management system that behaves like a **personal study conductor**, helping students organize, study, and revise in one glassmorphic interface.

---

## 3. Product Goals

### Primary Goals
1.  **Organize**: Categorize learning into Subjects and sub-Topics.
2.  **Act**: Create and track specific Study Tasks.
3.  **Visualize**: Provide a data-driven Dashboard for progress tracking.
4.  **Reinforce**: Implement a Spaced Repetition logic for revision.
5.  **Accelerate**: Use AI to generate summaries, quizzes, and flashcards instantly.

---

## 4. Core Functional Modules

### Feature 1: Subject & Topic Management
- **Subject Fields**: Name, Description, and Color Label.
- **Topic Statuses**: `Not Started`, `In Progress`, `Completed`, `Needs Revision`.
- **Logic**: Topics automatically transition to "Needs Revision" 3 days after completion to encourage review.

### Feature 2: Smart Study Tasks
- **Categorization**: Tasks are linked to specific Subjects and Topics.
- **Priority Levels**: `Low`, `Medium`, `High` with distinct visual coding.
- **Dynamic Tabs**: Filter tasks by `All`, `Pending`, `Completed`, `Overdue`, and `Revision`.

### Feature 3: Progress Dashboard
- **Productivity Analytics**: A real-time **Weekly Productivity Graph** (Recharts) that tracks daily completions.
- **Visual Progress**: Circular progress indicators and Subject Distribution charts.
- **Revision Reminders**: An automated list of topics requiring immediate attention.

### Feature 4: AI Study Assistant
- **Engine**: Powered by **Google Gemini 2.5 Flash Lite**.
- **Tools**:
    - **Topic Summaries**: Rich markdown summaries of any concept.
    - **Practice Quizzes**: Interactive MCQ/Open-ended questions.
    - **Flashcards**: Bulk-generation of active recall cards with flip animations.

### Feature 5: Search & Navigation
- **Global Search**: Find tasks and topics instantly.
- **Responsive Layout**: A premium floating sidebar for seamless navigation between modules.

---

## 5. Technical Architecture

### Tech Stack
- **Frontend**: React 19, Vite.
- **Styling**: Vanilla CSS with Glassmorphism (Frosted Glass) and CSS Variables.
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **Charts**: Recharts.
- **Dates**: date-fns.

### React Concepts Implemented
- **useState**: For local form handling and UI states.
- **useEffect**: For API fetching, daily quote resets, and state synchronization.
- **Context API (`StudyContext`)**: Centralized global state for all project data (Subjects, Topics, Tasks).
- **Custom Hooks**:
    - `useTasks()`: CRUD operations and task filtering.
    - `useProgress()`: Mathematical calculations for completion rates.

### API Integration
- **Google Generative AI**: For the AI Assistant features.
- **API Ninjas**: For the secure daily motivational quotes.
- **Environment Security**: All keys are handled via `.env` and `import.meta.env` for security.

---

## 6. Project Structure
```text
src
 ├── components    # Reusable UI (Cards, Modals, Stats)
 ├── pages         # Main views (Dashboard, AITools, etc.)
 ├── context       # Global state (StudyContext)
 ├── hooks         # Business logic (useTasks, useProgress)
 ├── services      # AI & API configuration
 ├── services      # Global styles and design system
 └── App.jsx       # Routing and layout
```

---

## 7. Logic Evaluation
1.  **Algorithmic Planning**: Topics are automatically flagged for revision via background interval checks in `StudyContext`.
2.  **AI Engineering**: High-fidelity prompting used to enforce valid JSON responses for flashcards.
3.  **Visualization Logic**: Dynamic line graphing of historical completions using a `useMemo` dependency array.
4.  **UI Mastery**: Custom glassmorphism system using HSL colors and variable-based design tokens.

---

## 8. Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Launch the dev server.
- `npm run build`: Generate production bundle.
