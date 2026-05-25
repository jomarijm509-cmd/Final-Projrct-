import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container-fluid">
      <div class="row min-vh-100">
        <!-- Sidebar -->
        <nav class="col-md-2 col-lg-2 d-md-block bg-dark text-white sidebar py-4 px-0"
             style="min-height: calc(100vh - 60px)">
          <div class="px-3 mb-4">
            <h6 class="text-uppercase text-muted fw-bold small letter-spacing">Admin Panel</h6>
          </div>
          <ul class="nav flex-column px-2">
            <li class="nav-item">
              <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
                 class="nav-link text-white-50 rounded px-3 py-2">
                🏠 Overview
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/admin/accounts" routerLinkActive="active"
                 class="nav-link text-white-50 rounded px-3 py-2">
                👥 Accounts
              </a>
            </li>
          </ul>
        </nav>

        <!-- Main content -->
        <main class="col-md-10 col-lg-10 ms-sm-auto px-md-4 py-4">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .nav-link:hover { background: rgba(255,255,255,0.1) !important; color: white !important; }
    .nav-link.active { background: #0d6efd !important; color: white !important; }
  `]
})
export class AdminLayoutComponent {}
