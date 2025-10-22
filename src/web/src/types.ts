// API Message types (matching backend chat domain)
export enum ChatRole {
  SUMMARY = 'summary',
  USER = 'user',
  PODBOT = 'podbot'
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// API Request/Response types
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export type SessionHistoryResponse = ChatMessage[];

// Frontend UI state types
export interface AppState {
  username: string;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// UI Message display type
export interface DisplayMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}