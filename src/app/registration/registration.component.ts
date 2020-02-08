import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { Router } from '@angular/router';
import { IUserRegistration } from '../interface/IUserRegistration';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordAgain: string;
  country: string;
  city: string;
  street: string;
  streetNumber: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  register(): void {
    if (this.password !== this.passwordAgain) {
      this.translate.get('popup.registration.mismatching_passwords').subscribe(text => {
        alert(text);
      });
      return;
    }

    if (
      this.email === undefined ||
      this.firstname === undefined ||
      this.lastname === undefined ||
      this.password === undefined ||
      this.country === undefined ||
      this.city === undefined ||
      this.street === undefined ||
      this.streetNumber === undefined
    ) {
      this.translate.get('popup.registration.fill_in_all_fields').subscribe(text => {
        alert(text);
      });
      return;
    }

    const user: IUserRegistration = {
      email: this.email,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname,
      country: this.country,
      city: this.city,
      street: this.street,
      streetNumber: this.streetNumber
    };

    this.userService.register(user).subscribe(
      data => {
        if (data['result'] === 'success') {
          this.translate.get('popup.registration.success').subscribe(text => {
            alert(text);
          });
          this.router.navigateByUrl('/login');
        }
      },
      error => {
        if (error.error.message === 'exists') {
          this.translate.get('popup.registration.already_registered').subscribe(text => {
            alert(text);
          });
        } else {
          console.log(error);
        }
      }
    );
  }
}
