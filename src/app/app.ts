import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from './_services/account.service';
import { AlertComponent } from './_components/alert.component';
import { Account } from './_models/account';
import { Role } from './_models/role';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AlertComponent],
  template: `
    <!-- Navbar — only visible when logged in -->
    <nav *ngIf="account" class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div class="container-fluid px-4">
        <!-- Brand -->
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" routerLink="/">
          <span class="fs-5">🔐</span>
          <span>Auth Boilerplate</span>
        </a>

        <button class="navbar-toggler border-0" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <!-- Left links -->
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/"
                 routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
                🏠 Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/profile" routerLinkActive="active">
                👤 Profile
              </a>
            </li>
            <li *ngIf="isAdmin" class="nav-item">
              <a class="nav-link px-3" routerLink="/admin" routerLinkActive="active">
                🛡️ Admin
              </a>
            </li>
          </ul>

          <!-- Right side -->
          <div class="d-flex align-items-center gap-3">
            <span class="text-white-50 small d-none d-md-inline">
              {{ account.firstName }} {{ account.lastName }}
            </span>
            <span class="badge rounded-pill px-3 py-1"
                  [ngClass]="isAdmin ? 'bg-danger' : 'bg-secondary'">
              {{ isAdmin ? '👑 Admin' : '👤 User' }}
            </span>
            <button class="btn btn-outline-light btn-sm px-3" (click)="logout()">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Global alerts -->
    <div class="alert-container">
      <app-alert></app-alert>
    </div>

    <!-- Router outlet -->
    <router-outlet></router-outlet>
  `,
  styles: [`
    .alert-container {
      position: sticky;
      top: 0;
      z-index: 1040;
    }
    .navbar .nav-link.active {
      color: white !important;
      font-weight: 600;
    }
  `]
})
export class AppComponent implements OnInit {
  account: Account | null = null;
  get isAdmin() { return this.account?.role === Role.Admin; }

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.account.subscribe(a => this.account = a);
  }

  logout() {
    this.accountService.logout();
  }
}
