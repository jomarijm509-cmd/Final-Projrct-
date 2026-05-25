import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container py-4">
      <div class="row g-4">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-3 text-center">
              <div class="avatar-circle mx-auto mb-2">
                {{ account?.firstName?.charAt(0) }}{{ account?.lastName?.charAt(0) }}
              </div>
              <h6 class="fw-bold mb-0">{{ account?.firstName }} {{ account?.lastName }}</h6>
              <p class="text-muted small mb-3">{{ account?.email }}</p>
              <hr class="my-2" />
              <nav class="nav flex-column text-start">
                <a routerLink="/profile" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
                   class="nav-link rounded px-3 py-2">
                  📋 Profile Details
                </a>
                <a routerLink="/profile/update" routerLinkActive="active"
                   class="nav-link rounded px-3 py-2">
                  ✏️ Update Profile
                </a>
              </nav>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div class="col-md-9">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: #0d6efd;
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; font-weight: 700;
    }
    .nav-link { color: #495057; font-weight: 500; transition: all .15s; }
    .nav-link:hover { background: #f0f4ff; color: #0d6efd; }
    .nav-link.active { background: #0d6efd !important; color: white !important; }
  `]
})
export class ProfileLayoutComponent {
  account: Account | null;
  constructor(private accountService: AccountService) {
    this.account = this.accountService.accountValue;
  }
}
