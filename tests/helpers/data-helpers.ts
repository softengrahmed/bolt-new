import * as fs from 'fs';
import * as path from 'path';

/**
 * Data Helper utilities for test data management
 * Provides methods for loading and managing test fixtures
 */
export class DataHelpers {
  private readonly fixturesPath: string;

  constructor() {
    this.fixturesPath = path.join(process.cwd(), 'tests', 'fixtures');
  }

  /**
   * Load JSON fixture file
   * @param fileName - Name of the fixture file (without .json extension)
   */
  loadFixture<T>(fileName: string): T {
    const filePath = path.join(this.fixturesPath, `${fileName}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  }

  /**
   * Get test user data
   * @param userType - Type of user (e.g., 'admin', 'standard', 'guest')
   */
  getTestUser(userType: string = 'standard'): User {
    const users = this.loadFixture<{ users: User[] }>('users');
    const user = users.users.find((u) => u.type === userType);
    
    if (!user) {
      throw new Error(`User type '${userType}' not found in fixtures`);
    }
    
    return user;
  }

  /**
   * Get random item from array
   * @param array - Source array
   */
  getRandomItem<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot get random item from empty array');
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random string
   * @param length - Length of the string
   * @param includeNumbers - Include numbers in the string
   */
  generateRandomString(length: number = 10, includeNumbers: boolean = true): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const chars = includeNumbers ? letters + numbers : letters;
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   * @param domain - Email domain (default: example.com)
   */
  generateRandomEmail(domain: string = 'example.com'): string {
    const username = this.generateRandomString(8, false).toLowerCase();
    const timestamp = Date.now();
    return `${username}.${timestamp}@${domain}`;
  }

  /**
   * Generate timestamp-based unique identifier
   */
  generateUniqueId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Deep clone an object
   * @param obj - Object to clone
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  /**
   * Merge objects
   * @param target - Target object
   * @param source - Source object
   */
  mergeObjects<T>(target: T, source: Partial<T>): T {
    return { ...target, ...source };
  }

  /**
   * Wait for a specified time
   * @param ms - Milliseconds to wait
   */
  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Type definitions
export interface User {
  type: string;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}
