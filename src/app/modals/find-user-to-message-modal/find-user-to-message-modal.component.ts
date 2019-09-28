import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { IUser } from 'src/app/interface/IUser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-find-user-to-message-modal',
  templateUrl: './find-user-to-message-modal.component.html',
  styleUrls: ['./find-user-to-message-modal.component.css']
})
export class FindUserToMessageModalComponent implements OnInit, AfterViewInit {
  searchedName = '';
  suggestedUsers: Array<any>;
  allUsers: Array<IUser>;

  constructor(private ngxSmartModalService: NgxSmartModalService, private userService: UserService) {}

  ngOnInit() {
    this.suggestedUsers = new Array();
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users;
    });
  }

  ngAfterViewInit() {
    const findUserToMessageModal = this.ngxSmartModalService.getModal('findUserToMessageModal');

    findUserToMessageModal.onOpen.subscribe((modal: NgxSmartModalComponent) => {
      this.searchedName = '';
    });
  }

  navigateToMessageBlock(email: String): void {
    console.log(email);
  }

  searchedNameChanged(): void {
    this.suggestedUsers.length = 0;

    if (this.searchedName.length < 2) {
      return;
    }

    const unifiedSearchedName = this.getUnifiedUsername(this.searchedName);
    this.allUsers.forEach(user => {
      if (this.isUserRelevantForSearch(user, unifiedSearchedName)) {
        this.suggestedUsers.push(user);
      }
    });
  }

  isUserRelevantForSearch(user: IUser, unifiedSearchedName: string): boolean {
    const unifiedFirstname = this.getUnifiedUsername(user.firstName);
    const unifiedLastname = this.getUnifiedUsername(user.lastName);
    const unifiedFullname1 = unifiedFirstname + unifiedLastname;
    const unifiedFullname2 = unifiedLastname + unifiedFirstname;

    return (
      unifiedFirstname.includes(unifiedSearchedName) ||
      unifiedLastname.includes(unifiedSearchedName) ||
      unifiedFullname1.includes(unifiedSearchedName) ||
      unifiedFullname2.includes(unifiedSearchedName)
    );
  }

  getUnifiedUsername(username: string) {
    return username.toLowerCase().replace(/\s/g, '');
  }
}
