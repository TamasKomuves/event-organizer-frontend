import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

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
      alert('Please fill the fields!');
      return;
    }

    this.userService
      .register(
        this.email,
        this.password,
        this.firstname,
        this.lastname,
        this.country,
        this.city,
        this.street,
        this.streetNumber
      )
      .subscribe(
        data => {
          if (data['result'] === 'success') {
            alert('success');
            this.router.navigateByUrl('/login');
          } else if (data['result'] === 'exists') {
            alert('This email is already registered');
          }
        },
        error => {
          alert(error);
        }
      );
  }
}
