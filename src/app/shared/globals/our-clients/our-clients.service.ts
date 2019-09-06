import { Injectable, Inject } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class OurClientsService {
  constructor(private http: TransferHttpService) { }

  getOurClientsServiceData() {
    return this.http.get('/api/v1/ourclients');
  }
}
