import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { error } from 'console';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _UsersService = inject(UsersService);
  private readonly _Router = inject(Router);

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, Validators.required, Validators.email],
    password: [null, Validators.required],
  });

  errorMessage = '';
  isLoading: boolean = false;
  loginSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this._UsersService.signin(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userToken', res.token);
        this._Router.navigate(['/timeline']);

        // localStorage.setItem("userToken",res)
      },
      error: (err) => {
        this.isLoading = false;

        this.errorMessage = 'incorrect email or password';
        console.log(err);
      },
    });
  }
}
