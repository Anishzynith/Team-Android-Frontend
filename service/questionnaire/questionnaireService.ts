import { storage } from "../storage";

// Types
export type QuestionType = 
  | 'single'
  | 'multiple'
  | 'text'
  | 'dropdown'
  | 'rating'
  | 'date'
  | 'yesno';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  isRequired: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Answer {
  questionId: string;
  value: any;
  timestamp: number;
}

export interface QuestionnaireState {
  currentQuestionIndex: number;
  answers: Answer[];
  isComplete: boolean;
  startedAt: number;
  completedAt?: number;
}

// ✅ Mock questions data based on your flow
const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    question: "Have you run before?",
    type: "single",
    options: [
      { id: "opt1", label: "Yes", value: "yes" },
      { id: "opt2", label: "No", value: "no" }
    ],
    isRequired: true
  },
  {
    id: "q2",
    question: "How many days per week do you plan to run?",
    type: "single",
    options: [
      { id: "opt1", label: "1-2 days", value: "1-2" },
      { id: "opt2", label: "3-4 days", value: "3-4" },
      { id: "opt3", label: "5-6 days", value: "5-6" },
      { id: "opt4", label: "7 days", value: "7" }
    ],
    isRequired: true
  },
  {
    id: "q3",
    question: "What was your recent long run distance (in km)?",
    type: "text",
    isRequired: true,
    placeholder: "Enter distance in km (e.g., 5, 10, 21)"
  },
  {
    id: "q4",
    question: "What was your recent long run time (in minutes)?",
    type: "text",
    isRequired: true,
    placeholder: "Enter time in minutes (e.g., 30, 45, 60)"
  },
  {
    id: "q5",
    question: "Have you registered for any event?",
    type: "single",
    options: [
      { id: "opt1", label: "Yes", value: "yes" },
      { id: "opt2", label: "No", value: "no" }
    ],
    isRequired: true
  },
  {
    id: "q6",
    question: "What is the event name?",
    type: "text",
    isRequired: false,
    placeholder: "Enter the event name (e.g., City Marathon, 10K Run)"
  },
  {
    id: "q7",
    question: "What is the event distance (in km)?",
    type: "text",
    isRequired: false,
    placeholder: "Enter event distance in km (e.g., 5, 10, 21, 42)"
  },
  {
    id: "q8",
    question: "What is your target time for the event (in minutes)?",
    type: "text",
    isRequired: false,
    placeholder: "Enter target time in minutes (e.g., 60, 120, 180)"
  }
];

/**
 * Mock Questionnaire Service
 * Uses local JSON data instead of API
 * Can be easily swapped with real API later
 */
class MockQuestionnaireService {
  private readonly PROGRESS_KEY = storage.KEYS?.QUESTIONNAIRE_PROGRESS || 'questionnaire_progress';
  private readonly ANSWERS_KEY = storage.KEYS?.QUESTIONNAIRE_ANSWERS || 'questionnaire_answers';

  async getQuestions(): Promise<Question[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_QUESTIONS;
  }

  async submitAnswers(answers: Answer[]): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    await storage.setItem(this.ANSWERS_KEY, JSON.stringify(answers));
    console.log('Mock: Submitted answers:', answers);
    await this.clearProgress();
  }

  async saveProgress(state: QuestionnaireState): Promise<void> {
    await storage.setItem(this.PROGRESS_KEY, JSON.stringify(state));
  }

  async loadProgress(): Promise<QuestionnaireState | null> {
    const data = await storage.getItem(this.PROGRESS_KEY);
    if (data) {
      return JSON.parse(data) as QuestionnaireState;
    }
    return null;
  }

  async clearProgress(): Promise<void> {
    await storage.removeItem(this.PROGRESS_KEY);
    await storage.removeItem(this.ANSWERS_KEY);
  }
}

// ✅ Export the service instance (this is what you should import)
export const questionnaireService = new MockQuestionnaireService();

// ✅ Also export the class if needed (optional)
export { MockQuestionnaireService };