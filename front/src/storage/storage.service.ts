import { Injectable } from '@angular/core';
import { UniversalService } from 'src/universal/universal.service';
import { StorageStub } from './storage.stub';

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor(private universalService: UniversalService) {
    this.storage = this.universalService.isInBrowser
      ? localStorage
      : new StorageStub();
  }

  public setItem(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  public getItem(key: string): string {
    return this.storage.getItem(key);
  }
}
