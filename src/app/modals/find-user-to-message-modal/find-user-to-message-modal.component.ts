import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

@Component({
  selector: 'app-find-user-to-message-modal',
  templateUrl: './find-user-to-message-modal.component.html',
  styleUrls: ['./find-user-to-message-modal.component.css']
})
export class FindUserToMessageModalComponent implements OnInit, AfterViewInit {
  searchedName = '';
  suggestedUsers: Array<any>;

  constructor(private ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {
    this.suggestedUsers = new Array();
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

    const allUsersMock = new Array(
      { email: 'komuves.tomi@gmail.com', firstname: 'Ferkoka', lastname: 'Komuves' },
      { email: 'barna.viktor@gmail.com', firstname: 'Ferasz', lastname: 'Barna' },
      { email: 'gubik.gabor@gmail.com', firstname: 'Ferrr', lastname: 'Gubik' },
      { email: 'nagya.gergo@gmail.com', firstname: 'Gergo', lastname: 'Nagy A' },
      { email: 'nagya.gerdo@gmail.com', firstname: 'Gerdo', lastname: 'Nagy A' }
    );

    const unifiedSearchedName = this.getUnifiedUsername(this.searchedName);

    allUsersMock.forEach(user => {
      const unifiedFirstname = this.getUnifiedUsername(user.firstname);
      const unifiedLastname = this.getUnifiedUsername(user.lastname);
      const unifiedFullname1 = unifiedFirstname + unifiedLastname;
      const unifiedFullname2 = unifiedLastname + unifiedFirstname;

      if (
        unifiedFirstname.includes(unifiedSearchedName) ||
        unifiedLastname.includes(unifiedSearchedName) ||
        unifiedFullname1.includes(unifiedSearchedName) ||
        unifiedFullname2.includes(unifiedSearchedName)
      ) {
        this.suggestedUsers.push(user);
      }
    });
  }

  getUnifiedUsername(username: string) {
    return username.toLowerCase().replace(/\s/g, '');
  }
}
