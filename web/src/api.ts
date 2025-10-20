import type { ChatRequest, ChatResponse, SessionHistoryResponse } from './types';

const API_BASE_URL = '/api';

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const chatApi = {
  // Get conversation history for a user
  async getSessionHistory(username: string): Promise<SessionHistoryResponse> {
    const response = await apiRequest<SessionHistoryResponse>(`/sessions/${username}`);
    return response;
  },

  // Send a message and get bot response
  async sendMessage(username: string, message: string): Promise<ChatResponse> {
    const request: ChatRequest = { message };
    return await apiRequest<ChatResponse>(`/sessions/${username}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Clear conversation history for a user
  async clearSession(username: string): Promise<void> {
    await apiRequest<void>(`/sessions/${username}`, {
      method: 'DELETE',
    });
  },

  // Health check endpoint
  async healthCheck(): Promise<{ status: string }> {
    return await apiRequest<{ status: string }>('/health');
  },
};

export { ApiError };