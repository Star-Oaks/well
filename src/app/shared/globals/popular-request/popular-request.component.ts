import { Component, OnInit, Input } from '@angular/core';
import { PopularRequest } from '../../model/popular-request';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/browser/environment.prod';

@Component({
  selector: 'app-popular-request',
  templateUrl: './popular-request.component.html',
  styleUrls: ['./popular-request.component.scss']
})
export class PopularRequestComponent implements OnInit {
  @Input('links') links: PopularRequest[] = [];
  public reqs: PopularRequest[] = [];
  constructor(
    private router: Router
  ) { }

  ngOnInit() {


  }
  ngOnChanges() {
    this.reqs = [];
    this.createRequests();
  }
  createRequests() {
    const urlTree = this.router.parseUrl(this.router.url);
    const uri = urlTree.root.children['primary'] ? '/' + urlTree.root.children['primary'].segments.map(it => it.path).join('/') : '';
    this.links.sort((a, b) => a.numberInSequence - b.numberInSequence).forEach(x => {
      if (!!x.text && x.text != "") {
        this.reqs.push({
          numberInSequence: x.numberInSequence,
          text: x.text,
          link: environment.host + uri + '/#' + x.numberInSequence
        })
      }
    })
  }
}
