import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../navbar/navbar';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent
  ],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})
export class AdminPanelComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);

  users: any[] = [];
  roles = ['Admin', 'Supervisor', 'Worker'];
  successMsg = '';
  errorMsg = '';
  isLoading = false;
  isLoadingUsers = false;

  createForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Worker', Validators.required]
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  loadUsers() {
    this.isLoadingUsers = true;
    this.userSvc.getAll().subscribe({
      next: u => {
        this.users = u;
        this.isLoadingUsers = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load users';
        this.isLoadingUsers = false;
      }
    });
  }

  createUser() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.createForm.invalid) return;
    this.isLoading = true;
    this.userSvc.create(this.createForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'User created successfully!';
        this.createForm.reset({ role: 'Worker' });
        this.loadUsers();
      },
      error: err => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Failed to create user';
      }
    });
  }

  changeRole(id: string, role: string) {
    this.userSvc.updateRole(id, role).subscribe({
      next: () => this.loadUsers(),
      error: () => this.errorMsg = 'Failed to update role'
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?'))
      this.userSvc.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: () => this.errorMsg = 'Failed to delete user'
      });
  }
}