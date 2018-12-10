import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-show-events',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {

  events: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllEvents().subscribe(data => {
      this.events = data;
    });
  }
}
