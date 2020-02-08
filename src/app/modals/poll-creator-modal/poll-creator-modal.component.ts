import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { IPollAnswer } from 'src/app/interface/IPollAnswer';
import { PollQuestionService } from 'src/app/services/rest/poll-question.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-poll-creator-modal',
  templateUrl: './poll-creator-modal.component.html',
  styleUrls: ['./poll-creator-modal.component.css']
})
export class PollCreatorModalComponent implements AfterViewInit {
  @Input() eventId: number;

  questionText: string;
  answers: Array<IPollAnswer>;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private pollQuestionService: PollQuestionService,
    private translate: TranslateService
  ) {
    this.initModal();
  }

  ngAfterViewInit() {
    const pollCreatorModal = this.ngxSmartModalService.getModal('pollCreatorModal');
    pollCreatorModal.onClose.subscribe(() => this.initModal());
  }

  initModal(): void {
    this.questionText = '';
    this.answers = new Array();
    this.addAnswer();
  }

  addAnswer(): void {
    this.answers.push({ text: '' });
  }

  removeAnswer(): void {
    this.answers.pop();
  }

  createPoll(): void {
    this.pollQuestionService.createPoll(this.eventId, this.questionText, this.answers).subscribe(
      result => {
        this.initModal();
        const pollCreatorModal = this.ngxSmartModalService.getModal('pollCreatorModal');
        pollCreatorModal.close();
      },
      error => {
        this.translate.get('popup.poll_creator.creation_error').subscribe(text => {
          alert(text);
        });
        console.log(error);
      }
    );
  }
}
