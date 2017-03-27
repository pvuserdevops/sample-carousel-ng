import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    defaultSize: number = 4;
    lastGroupPolicy: string = 'display-previous';
    alignmentType: string = 'align-center';
    relativeSizes: boolean = false;
}
