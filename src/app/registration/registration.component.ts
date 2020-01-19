import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/rest/user.service';
import { Router } from '@angular/router';
import { IUserRegistration } from '../interface/IUserRegistration';

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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}

  register(): void {
    if (this.password !== this.passwordAgain) {
      alert('The passwords are not matching');
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
      alert('Please fill in all the fields!');
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
          alert('success');
          this.router.navigateByUrl('/login');
        } else if (data['result'] === 'exists') {
          alert('This email is already registered');
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
