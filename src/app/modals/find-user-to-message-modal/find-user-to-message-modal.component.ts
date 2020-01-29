import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { IUser } from 'src/app/interface/IUser';
import { UserService } from 'src/app/services/rest/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-user-to-message-modal',
  templateUrl: './find-user-to-message-modal.component.html',
  styleUrls: ['./find-user-to-message-modal.component.css']
})
export class FindUserToMessageModalComponent implements OnInit, AfterViewInit {
  searchedName = '';
  suggestedUsers: Array<IUser>;
  allUsers: Array<IUser>;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.suggestedUsers = new Array<IUser>();
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users;
    });
  }

  ngAfterViewInit() {
    const findUserToMessageModal = this.ngxSmartModalService.getModal('findUserToMessageModal');
    findUserToMessageModal.dismissable = false;

    findUserToMessageModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.searchedName = '';
      this.suggestedUsers = new Array<IUser>();
    });
  }

  openChatpage(email: String): void {
    this.router.navigate(['/chat-page'], { queryParams: { email: email } });
  }

  searchedNameChanged(): void {
    this.suggestedUsers.length = 0;

    if (this.searchedName.length < 2) {
      return;
    }

    const unifiedSearchedName = this.getUnifiedString(this.searchedName);
    this.allUsers.forEach(user => {
      if (this.isUserRelevantForSearch(user, unifiedSearchedName)) {
        this.suggestedUsers.push(user);
      }
    });
  }

  isUserRelevantForSearch(user: IUser, unifiedSearchedName: string): boolean {
    const unifiedFirstname = this.getUnifiedString(user.firstName);
    const unifiedLastname = this.getUnifiedString(user.lastName);
    const unifiedFullname1 = unifiedFirstname + unifiedLastname;
    const unifiedFullname2 = unifiedLastname + unifiedFirstname;
    const unifiedEmail = this.getUnifiedString(user.email);

    return (
      unifiedFirstname.includes(unifiedSearchedName) ||
      unifiedLastname.includes(unifiedSearchedName) ||
      unifiedFullname1.includes(unifiedSearchedName) ||
      unifiedFullname2.includes(unifiedSearchedName) ||
      unifiedEmail.includes(unifiedSearchedName)
    );
  }

  getUnifiedString(username: string) {
    return username.toLowerCase().replace(/\s/g, '');
  }
}
