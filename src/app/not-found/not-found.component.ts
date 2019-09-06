import { Component, OnInit } from '@angular/core';
import { NotFoundService } from './not-found.service';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { Gtag } from 'angular-gtag';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BrowserService } from '../shared/services/browser.service';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public status: { code: number; message: string };

  constructor(
    private _notFoundService: NotFoundService,
    private readonly meta: MetaService,
    private translateCoreService: TranslateService,
    private gtag: Gtag,
    private router: Router,
    private browserService: BrowserService
  ) {
    let title = this.translateCoreService.instant('notFound');
    if (!title) {
      title = "404"
    }
    this.meta.setTitle(title);
    if (this.browserService.isBrowser) {
      this.gtag.pageview({
        page_title: title,
        page_path: this.router.url,
        page_location: environment.api + this.router.url
      });
    }
  }

  ngOnInit(): void {
    this._notFoundService.setStatus(404, 'Not Found');
  }
}
