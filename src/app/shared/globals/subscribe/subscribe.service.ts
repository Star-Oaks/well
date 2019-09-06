import { Injectable } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class SubscribeService {
  constructor(private http: TransferHttpService) {}

  postSubscribeData(email) {
    return this.http.post("/api/v1/mailing/subscribe", email);
  }
}
