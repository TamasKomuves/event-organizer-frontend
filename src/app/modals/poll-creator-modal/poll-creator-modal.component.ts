import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { IPollAnswer } from 'src/app/interface/IPollAnswer';

@Component({
  selector: 'app-poll-creator-modal',
  templateUrl: './poll-creator-modal.component.html',
  styleUrls: ['./poll-creator-modal.component.css']
})
export class PollCreatorModalComponent {
  @Input() eventId: number;

  questionText: string;
  answers: Array<IPollAnswer>;

  constructor(
    private userService: UserService,
    private ngxSmartModalService: NgxSmartModalService
  ) {
    this.answers = new Array<IPollAnswer>();
    this.answers.push({ text: '' });
  }

  addAnswer(): void {
    this.answers.push({ text: '' });
  }

  removeAnswer(): void {
    this.answers.pop();
  }

  createPoll(): void {
    this.userService.createPoll(this.eventId, this.questionText, this.answers).subscribe(
      result => {
        this.questionText = '';
        this.answers = new Array();
        const pollCreatorModal = this.ngxSmartModalService.getModal('pollCreatorModal');
        pollCreatorModal.close();
      },
      error => {
        alert('Error occured during poll creation!');
        console.log(error);
      }
    );
  }
}
