import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-poll-creator-modal',
  templateUrl: './poll-creator-modal.component.html',
  styleUrls: ['./poll-creator-modal.component.css']
})
export class PollCreatorModalComponent implements OnInit {
  questionText: string;
  answers: Array<any>;

  constructor(private userService: UserService) {}

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
    this.userService.createPoll(1, this.questionText, this.answers).subscribe(result => {
      console.log(result);
    });
  }
}
