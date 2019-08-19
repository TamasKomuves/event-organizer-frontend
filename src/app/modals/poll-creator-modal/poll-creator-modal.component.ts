import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-poll-creator-modal',
  templateUrl: './poll-creator-modal.component.html',
  styleUrls: ['./poll-creator-modal.component.css']
})
export class PollCreatorModalComponent implements OnInit {
  @Input() eventId: number;

  questionText: string;
  answers: Array<any>;

  constructor(private userService: UserService, private ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {
    this.answers = new Array();
  }

  addAnswer(): void {
    const id = this.answers.length + 1;
    this.answers.push({ answerId: 'Answer' + id, text: '' });
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
