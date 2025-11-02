import { Component, inject } from '@angular/core';
import {
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    TitleCasePipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  _FormBuilder = inject(FormBuilder);
  _Router = inject(Router);
  _UsersService = inject(UsersService);

  registerForm: FormGroup = this._FormBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          ),
        ],
      ],
      rePassword: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]],
    },
    { validators: [this.matchPassword] }
  );

  isMatch!: boolean | null;
  matchPassword(g: AbstractControl) {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  isLoading = false;
  errorMessage = '';
  signupSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this._UsersService.signup(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this._Router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.errorMessage = err.error.error;
        },
      });
    } else this.registerForm.invalid;
    {
      this.registerForm.markAllAsTouched();
      return;
    }
  }

  passwordRules = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  };

  passwordStarted = false;

  checkPasswordStrength() {
    const password = this.registerForm.get('password')?.value || '';
    this.passwordStarted = password.length > 0;
    this.passwordRules.length = password.length >= 8;
    this.passwordRules.uppercase = /[A-Z]/.test(password);
    this.passwordRules.lowercase = /[a-z]/.test(password);
    this.passwordRules.number = /[0-9]/.test(password);
    this.passwordRules.special = /[#?!@$%^&*-]/.test(password);

    // update validity dynamically
    const allValid = Object.values(this.passwordRules).every(Boolean);
    if (allValid) {
      this.registerForm.get('password')?.setErrors(null);
    } else {
      this.registerForm.get('password')?.setErrors({ weak: true });
    }
  }
}
