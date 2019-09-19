import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit {
  messages: any;

  constructor(private ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {}

  asd(): void {
    console.log('asd clicked');
  }

  openFindUserToMessageModal(): void {
    const modal = this.ngxSmartModalService.getModal('findUserToMessageModal');
    modal.open();
  }
}
