import { APIRequestContext, expect } from '@playwright/test';

/**
 * API Helper Utilities
 * 
 * Provides reusable functions for API interactions:
 * - REST API calls
 * - Response validation
 * - Test data seeding via API
 */

export class ApiHelper {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.baseURL = baseURL || process.env.BASE_URL || 'http://localhost:5173';
  }

  /**
   * Make a GET request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async get(endpoint: string, options?: { headers?: Record<string, string>; params?: Record<string, string> }) {
    const response = await this.request.get(`${this.baseURL}${endpoint}`, {
      headers: options?.headers,
      params: options?.params,
    });
    return response;
  }

  /**
   * Make a POST request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param options - Request options
   */
  async post(endpoint: string, data: unknown, options?: { headers?: Record<string, string> }) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      headers: options?.headers,
    });
    return response;
  }

  /**
   * Make a PUT request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param options - Request options
   */
  async put(endpoint: string, data: unknown, options?: { headers?: Record<string, string> }) {
    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      headers: options?.headers,
    });
    return response;
  }

  /**
   * Make a DELETE request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async delete(endpoint: string, options?: { headers?: Record<string, string> }) {
    const response = await this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: options?.headers,
    });
    return response;
  }

  /**
   * Verify response status
   * @param response - API response
   * @param expectedStatus - Expected HTTP status code
   */
  async assertStatus(response: { status: () => number }, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Verify response contains expected data
   * @param response - API response
   * @param expectedData - Expected data in response
   */
  async assertResponseContains(response: { json: () => Promise<unknown> }, expectedData: Record<string, unknown>): Promise<void> {
    const responseData = await response.json();
    expect(responseData).toMatchObject(expectedData);
  }

  /**
   * Get response body as JSON
   * @param response - API response
   */
  async getResponseJson<T>(response: { json: () => Promise<T> }): Promise<T> {
    return await response.json();
  }

  /**
   * Wait for API endpoint to be ready
   * @param endpoint - API endpoint to check
   * @param maxRetries - Maximum number of retries
   */
  async waitForEndpoint(endpoint: string, maxRetries: number = 10): Promise<void> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await this.get(endpoint);
        if (response.status() === 200) {
          return;
        }
      } catch (error) {
        // Continue retrying
      }
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error(`Endpoint ${endpoint} not ready after ${maxRetries} retries`);
  }
}
