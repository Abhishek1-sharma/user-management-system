import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, NavbarComponent],
  templateUrl: './forbidden.html'
})
export class ForbiddenComponent {}