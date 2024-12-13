import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  myForm!: FormGroup;
  isSuccessful: boolean = false;
  successfulMessage: string = '';
  isErrorMessage: boolean = false;
  errorMessage: string = '';
  error: string | null = null; 

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.myForm.controls;
  }

  async onSubmit() {
    if (this.myForm.valid) {
      try {
        const response = await this.userService.authenticateUser(
          this.myForm.value.username,
          this.myForm.value.password
        );
  
        if (response && response.token) {
          this.isSuccessful = true;
          this.successfulMessage = 'Bejelentkezés sikeres!';
          this.router.navigate(['/']);
        } else {
          this.isErrorMessage = true;
          this.errorMessage = response.error || 'Hiba történt a bejelentkezés során.';
          this.error = response.error;
        }
      } catch (error) {
        this.isErrorMessage = true;
        this.errorMessage = 'Hiba történt a bejelentkezés során.';
        this.error = 'Hiba történt a bejelentkezés során.';
      }
    }
  }
  
}
