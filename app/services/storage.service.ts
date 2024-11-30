import { ApplicationSettings } from '@nativescript/core';

export class StorageService {
  static setItem(key: string, value: any): void {
    ApplicationSettings.setString(key, JSON.stringify(value));
  }

  static getItem<T>(key: string): T | null {
    const value = ApplicationSettings.getString(key);
    return value ? JSON.parse(value) : null;
  }

  static removeItem(key: string): void {
    ApplicationSettings.remove(key);
  }

  static clear(): void {
    ApplicationSettings.clear();
  }
}