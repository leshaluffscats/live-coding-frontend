import {Component, inject, OnInit} from '@angular/core';
import { routerTransition } from './routing-animations';
import {ThemeService} from "./core/services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routerTransition ]
})
export class AppComponent implements OnInit{
  year = new Date().getFullYear();
  themeService = inject(ThemeService);

  ngOnInit(){
    this.themeService.init()

  }

  getState(outlet: any) {
    return outlet &&
    outlet.activatedRouteData &&
    outlet.activatedRouteData['state'];
  }
}
