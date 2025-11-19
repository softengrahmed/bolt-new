import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * API Helper utilities for backend integration
 * Provides methods for making API requests and validating responses
 */
export class ApiHelpers {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.baseURL = baseURL || process.env.API_BASE_URL || 'http://localhost:5173/api';
  }

  /**
   * Make a GET request
   * @param endpoint - API endpoint path
   * @param options - Request options (headers, params, etc.)
   */
  async get(endpoint: string, options?: Record<string, unknown>): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return await this.request.get(url, options);
  }

  /**
   * Make a POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Request options (headers, etc.)
   */
  async post(
    endpoint: string,
    data?: unknown,
    options?: Record<string, unknown>
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return await this.request.post(url, {
      data,
      ...options,
    });
  }

  /**
   * Make a PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Request options (headers, etc.)
   */
  async put(
    endpoint: string,
    data?: unknown,
    options?: Record<string, unknown>
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return await this.request.put(url, {
      data,
      ...options,
    });
  }

  /**
   * Make a DELETE request
   * @param endpoint - API endpoint path
   * @param options - Request options (headers, etc.)
   */
  async delete(endpoint: string, options?: Record<string, unknown>): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return await this.request.delete(url, options);
  }

  /**
   * Validate response status code
   * @param response - API response
   * @param expectedStatus - Expected HTTP status code
   */
  async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status(), `Expected status ${expectedStatus}`).toBe(expectedStatus);
  }

  /**
   * Get response body as JSON
   * @param response - API response
   */
  async getResponseJson<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }

  /**
   * Validate response contains expected data
   * @param response - API response
   * @param expectedData - Expected data object
   */
  async assertResponseContains(
    response: APIResponse,
    expectedData: Record<string, unknown>
  ): Promise<void> {
    const responseBody = await response.json();
    
    Object.keys(expectedData).forEach((key) => {
      expect(responseBody[key], `Response should contain ${key}`).toBeDefined();
      expect(responseBody[key], `${key} should match expected value`).toEqual(expectedData[key]);
    });
  }

  /**
   * Create authentication headers
   * @param token - Authentication token
   */
  getAuthHeaders(token: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Wait for API response with retry
   * @param endpoint - API endpoint
   * @param maxRetries - Maximum number of retries
   * @param retryDelay - Delay between retries in ms
   */
  async waitForResponse(
    endpoint: string,
    maxRetries: number = 5,
    retryDelay: number = 1000
  ): Promise<APIResponse | null> {
    for (let i = 0; i < maxRetries; i++) {
      const response = await this.get(endpoint);
      if (response.ok()) {
        return response;
      }
      await this.sleep(retryDelay);
    }
    return null;
  }

  /**
   * Sleep utility
   * @param ms - Milliseconds to sleep
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
