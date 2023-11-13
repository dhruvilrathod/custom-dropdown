import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-popover',
  templateUrl: './sample-popover.component.html',
  styleUrls: ['./sample-popover.component.scss']
})
export class SamplePopoverComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  /**
    * @description - On open action menu
    * @memberof FileActionsComponent
    */
  onOpenMenu() {
    console.log('oprn triueeger');
    
  };

  /**
   * @description - On close action menu
   * @memberof FileActionsComponent
   */
  onCloseMenu() {
    console.log('close triueeger');
  }

  clickaaa() {
    console.log('clok');
    
  }

}
