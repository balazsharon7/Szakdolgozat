import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  error: string | null = null;
  myForm!: FormGroup;
  isPrivacyPolicyChecked = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      uName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      privacyPolicy: [false, Validators.requiredTrue],
    });
    
  }

  isSuccessful: boolean = false;
  successfulMessage: string = '';
  isErrorMessage: boolean = false;
  errorMessage: string = '';

  get f() {
    return this.myForm.controls;
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.isErrorMessage = true;
      this.errorMessage = 'Kérjük, töltse ki az összes kötelező mezőt és fogadja el az adatvédelmi szabályzatot!';
      Object.keys(this.myForm.controls).forEach((field) => {
        const control = this.myForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.postDataToApi();
  }
  

  
  async postDataToApi() {
    try {
      const isSuccessful = await this.userService.registerUser(
        this.myForm.value.email,
        this.myForm.value.uName,
        this.myForm.value.password,
        this.myForm.value.role
      );
      if (isSuccessful) {
        this.isSuccessful = true;
        this.successfulMessage = 'A regisztráció sikeres volt, most jelentkezzen be!';
        setTimeout(() => this.router.navigate(['/login']), 2000); 
      }
    } catch (error) {
      this.isErrorMessage = true;
      if (error === 403) {
        this.errorMessage = 'Hibás e-mail, felhasználónév vagy jelszó!';
      } else {
        this.errorMessage = 'Ez a felhasználó már létezik!';
      }
    }
  }
  
}
