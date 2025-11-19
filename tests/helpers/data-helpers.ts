import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Data Helper Utilities
 * 
 * Provides functions for:
 * - Dynamic test data generation using Faker
 * - Loading test fixtures
 * - Data validation
 */

export class DataHelper {
  /**
   * Generate random user data
   */
  static generateUserData() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: this.generateSecurePassword(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
    };
  }

  /**
   * Generate secure password
   * @param length - Password length (default: 12)
   */
  static generateSecurePassword(length: number = 12): string {
    return faker.internet.password({ length, memorable: false, pattern: /[A-Za-z0-9!@#$%^&*]/ });
  }

  /**
   * Generate random email
   */
  static generateEmail(): string {
    return faker.internet.email();
  }

  /**
   * Generate random string
   * @param length - String length
   */
  static generateRandomString(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  /**
   * Generate random number
   * @param min - Minimum value
   * @param max - Maximum value
   */
  static generateRandomNumber(min: number = 1, max: number = 1000): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate random date
   * @param past - Generate past date (default: true)
   */
  static generateRandomDate(past: boolean = true): Date {
    return past ? faker.date.past() : faker.date.future();
  }

  /**
   * Generate random company data
   */
  static generateCompanyData() {
    return {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    };
  }

  /**
   * Generate random product data
   */
  static generateProductData() {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
    };
  }

  /**
   * Load fixture data from JSON file
   * @param fixtureName - Name of the fixture file (without .json extension)
   */
  static loadFixture<T>(fixtureName: string): T {
    const fixturePath = path.join(__dirname, '../fixtures', `${fixtureName}.json`);
    const fileContent = fs.readFileSync(fixturePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  }

  /**
   * Save data to fixture file
   * @param fixtureName - Name of the fixture file
   * @param data - Data to save
   */
  static saveFixture(fixtureName: string, data: unknown): void {
    const fixturePath = path.join(__dirname, '../fixtures', `${fixtureName}.json`);
    fs.writeFileSync(fixturePath, JSON.stringify(data, null, 2));
  }

  /**
   * Generate unique identifier
   */
  static generateUniqueId(): string {
    return faker.string.uuid();
  }

  /**
   * Generate timestamp
   */
  static generateTimestamp(): number {
    return Date.now();
  }

  /**
   * Wait for specified duration
   * @param ms - Milliseconds to wait
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
