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
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
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
    }
  }
}
