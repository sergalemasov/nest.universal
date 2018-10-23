import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class UniversalService {
  private _isInBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this._isInBrowser = isPlatformBrowser(platformId);
  }

  get isInBrowser(): boolean {
    return this._isInBrowser;
  }
}
