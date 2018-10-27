export class StorageStub implements Storage {
  public readonly length: number;

  [name: string]: any;

  public clear(): void {}

  public getItem(_key: string): string | null { return null }

  public key(_index: number): string | null { return null }

  public removeItem(_key: string): void {}

  public setItem(key: string, value: string): void {}
}
