import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class NotFoundService {
  constructor(
    @Optional()
    @Inject(RESPONSE)
    private _response: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  public setStatus(code: number, message?: string): void {
    if (this._response) {
      this._response.statusCode = code;
      if (message) {
        this._response.statusMessage = message;
      }
    }
    if (isPlatformServer(this.platformId)) {
      this._response.status(code);
    }
  }
}
