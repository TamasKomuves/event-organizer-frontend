import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { IPasswordChange } from '../interface/IPasswordChange';

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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(currentUser => {
      this.firstname = currentUser.firstName;
      this.lastname = currentUser.lastName;

      this.userService.getAddressById(currentUser.addressId).subscribe(address => {
        this.country = address.country;
        this.city = address.city;
        this.street = address.street;
        this.streetNumber = address.streetNumber;
      });
    });
  }

  saveGeneral(): void {
    if (!this.isNonEmptyString(this.firstname) || !this.isNonEmptyString(this.lastname)) {
      alert('Please fill in all fields!');
      return;
    }

    this.userService.getCurrentUser().subscribe(currentUser => {
      this.userService.updateUserName(currentUser.email, this.firstname, this.lastname).subscribe(result => {
        if (result['result'] === 'success') {
          alert('Updated');
        }
      });
    });
  }

  saveAddress(): void {
    if (
      !this.isNonEmptyString(this.country) ||
      !this.isNonEmptyString(this.city) ||
      !this.isNonEmptyString(this.street) ||
      !this.isNonEmptyString(this.streetNumber)
    ) {
      alert('Please fill in all fields!');
      return;
    }

    this.userService.getCurrentUser().subscribe(currentUser => {
      this.userService
        .updateAddress(currentUser.addressId, this.country, this.city, this.street, this.streetNumber)
        .subscribe(result => {
          if (result['result'] === 'success') {
            alert('Updated');
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
      alert('Empty field');
      return;
    }
    if (this.newPassword !== this.newPasswordAgain) {
      alert('Passwords are mismatching');
      return;
    }

    const passwordChange: IPasswordChange = {
      oldPassword: this.oldPassword,
      password: this.newPassword,
      passwordAgain: this.newPasswordAgain
    };
    this.userService.changePassword(passwordChange).subscribe(
      result => {
        alert('Password changed');
        this.clearPasswordFields();
      },
      error => {
        alert('Cannot change the password');
        this.clearPasswordFields();
      }
    );
  }

  deleteProfile(): void {
    this.userService.getCurrentUser().subscribe(currentUser => {
      this.userService.deleteUser(currentUser.email).subscribe(
        result => {
          if (result['result'] === 'success') {
            alert('Profile deleted');
            this.router.navigateByUrl('/login');
          }
        },
        error => {
          alert('Error occured');
        }
      );
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
