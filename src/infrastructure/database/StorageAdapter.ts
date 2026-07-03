import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageAdapter {
  private key: string;

  constructor(key: string = 'characters') {
    this.key = key;
  }

  async saveData(data: string): Promise<void> {
    await AsyncStorage.setItem(this.key, data);
  }

  async loadData(): Promise<string | null> {
    return await AsyncStorage.getItem(this.key);
  }

  async deleteData(): Promise<void> {
    await AsyncStorage.removeItem(this.key);
  }

  // Если используете SQLite
  async executeQuery(query: string, params?: any[]): Promise<any[]> {
    // SQLite логика
    return [];
  }
}