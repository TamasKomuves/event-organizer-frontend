import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit {
  messages: any;

  constructor() {}

  ngOnInit() {}

  asd(): void {
    console.log('asd clicked');
  }
}
