import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(currentUser => {
      this.firstname = currentUser['firstName'];
      this.lastname = currentUser['lastName'];

      this.userService.getAddressById(currentUser['addressId']).subscribe(address => {
        this.country = address['country'];
        this.city = address['city'];
        this.street = address['street'];
        this.streetNumber = address['streetNumber'];
      });
    });
  }

  saveGeneral(): void {

  }

  saveAddress(): void {

  }

  savePassword(): void {

  }

  deleteProfile(): void {

  }

}
