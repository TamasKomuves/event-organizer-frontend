import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { IPasswordChange } from '../interface/IPasswordChange';
import { MessageService } from '../services/message.service';
import { AddressService } from '../services/rest/address.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  firstname: string;
  lastname: string;
  country: string;
  city: string;
  street: string;
  streetNumber: string;
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private addressService: AddressService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(currentUser => {
      this.firstname = currentUser.firstName;
      this.lastname = currentUser.lastName;

      this.addressService.getAddressById(currentUser.addressId).subscribe(address => {
        this.country = address.country;
        this.city = address.city;
        this.street = address.street;
        this.streetNumber = address.streetNumber;
      });
    });
  }

  saveGeneral(): void {
    if (!this.isNonEmptyString(this.firstname) || !this.isNonEmptyString(this.lastname)) {
      this.translate.get('popup.settings.fill_in_all_fields').subscribe(text => {
        alert(text);
      });
      return;
    }

    const userEmail = sessionStorage.getItem('userEmail');
    this.userService.updateUserName(userEmail, this.firstname, this.lastname).subscribe(result => {
      if (result['result'] === 'success') {
        this.translate.get('popup.settings.general_updated').subscribe(text => {
          alert(text);
        });
      }
    });
  }

  saveAddress(): void {
    if (
      !this.isNonEmptyString(this.country) ||
      !this.isNonEmptyString(this.city) ||
      !this.isNonEmptyString(this.street) ||
      !this.isNonEmptyString(this.streetNumber)
    ) {
      this.translate.get('popup.settings.fill_in_all_fields').subscribe(text => {
        alert(text);
      });
      return;
    }

    this.userService.getCurrentUser().subscribe(currentUser => {
      this.addressService
        .updateAddress(
          currentUser.addressId,
          this.country,
          this.city,
          this.street,
          this.streetNumber
        )
        .subscribe(result => {
          if (result['result'] === 'success') {
            this.translate.get('popup.settings.address_updated').subscribe(text => {
              alert(text);
            });
          }
        });
    });
  }

  changePassword(): void {
    if (
      !this.isNonEmptyString(this.oldPassword) ||
      !this.isNonEmptyString(this.newPassword) ||
      !this.isNonEmptyString(this.newPasswordAgain)
    ) {
      this.translate.get('popup.settings.fill_in_all_fields').subscribe(text => {
        alert(text);
      });
      return;
    }
    if (this.newPassword !== this.newPasswordAgain) {
      this.translate.get('popup.settings.mismatching_passwords').subscribe(text => {
        alert(text);
      });
      return;
    }

    const passwordChange: IPasswordChange = {
      oldPassword: this.oldPassword,
      password: this.newPassword,
      passwordAgain: this.newPasswordAgain
    };
    this.userService.changePassword(passwordChange).subscribe(
      result => {
        this.translate.get('popup.settings.password_updated').subscribe(text => {
          alert(text);
        });
        this.clearPasswordFields();
      },
      error => {
        this.translate.get('popup.settings.password_change_error').subscribe(text => {
          alert(text);
        });
        this.clearPasswordFields();
      }
    );
  }

  deleteProfile(): void {
    this.translate.get('popup.settings.confirm_profile_deletion').subscribe(text => {
      if (confirm(text)) {
        this.userService.deleteUser().subscribe(result => {
          sessionStorage.setItem('token', '');
          sessionStorage.setItem('userEmail', '');
          this.router.navigateByUrl(`/login`);
          this.messageService.sendLoggedInMessage(false);
        });
      }
    });
  }

  isNonEmptyString(text: string): boolean {
    return !isNullOrUndefined(text) && text !== '';
  }

  clearPasswordFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.newPasswordAgain = '';
  }
}
