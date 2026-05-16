import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  isPlatformBrowser,
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  form: FormGroup;

  error = '';

  loading = false;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  submit() {

    if (!isPlatformBrowser(this.platformId)) return;

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.error = '';

    this.cdr.detectChanges();

    const { username, password } = this.form.value;

    this.auth.login(username, password).subscribe({

      next: () => {

        this.loading = false;

        this.cdr.detectChanges();

        this.router.navigate(['/camera']);
      },

      error: (err) => {

        this.loading = false;

        if (err.status === 400) {

          this.error =
            err.error?.message ||
            'Invalid username or password';

        } else if (err.status === 429) {

          this.error =
            'Too many attempts. Please wait 15 minutes.';

        } else if (err.status === 0) {

          this.error =
            'Cannot connect to server. Is the backend running?';

        } else {

          this.error =
            'Something went wrong. Please try again.';
        }

        this.cdr.detectChanges();
      }
    });
  }
}