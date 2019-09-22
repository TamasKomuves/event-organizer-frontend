import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit {
  messages: any;

  constructor(private ngxSmartModalService: NgxSmartModalService, private router: Router) {}

  ngOnInit() {}

  openChatpage(email: string): void {
    this.router.navigate(['/chat-page'], { queryParams: { email: email } });
  }

  openFindUserToMessageModal(): void {
    const modal = this.ngxSmartModalService.getModal('findUserToMessageModal');
    modal.open();
  }
}
