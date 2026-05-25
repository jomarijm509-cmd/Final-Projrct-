import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '@app/_services';
import { Account, Role } from '@app/_models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <!-- Welcome Card -->
          <div class="card border-0 shadow rounded-4 overflow-hidden">
            <div class="card-header bg-primary text-white py-4 text-center">
              <div class="avatar-circle mx-auto mb-3">
                {{ account?.firstName?.charAt(0) }}{{ account?.lastName?.charAt(0) }}
              </div>
              <h4 class="fw-bold mb-1">Welcome, {{ account?.firstName }}!</h4>
              <p class="mb-0 opacity-75">{{ account?.email }}</p>
            </div>
            <div class="card-body p-4">
              <!-- Role badge -->
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <p class="text-muted small mb-0">Signed in as</p>
                  <span class="fw-semibold">{{ account?.title }} {{ account?.firstName }} {{ account?.lastName }}</span>
                </div>
                <span class="badge rounded-pill px-3 py-2 fs-6"
                      [ngClass]="isAdmin ? 'bg-danger' : 'bg-secondary'">
                  {{ isAdmin ? '👑 Admin' : '👤 User' }}
                </span>
              </div>

              <!-- Token debug info -->
              <div class="bg-light rounded-3 p-3 mb-4 font-monospace small">
                <div class="text-muted mb-1">JWT Token (truncated)</div>
                <div class="text-break text-primary" style="word-break:break-all;font-size:0.7rem">
                  {{ account?.jwtToken?.substring(0, 80) }}…
                </div>
              </div>

              <!-- Actions -->
              <div class="d-grid gap-2">
                <a routerLink="/profile" class="btn btn-outline-primary">
                  👤 View Profile
                </a>
                <a *ngIf="isAdmin" routerLink="/admin" class="btn btn-danger">
                  🛡️ Admin Panel
                </a>
              </div>
            </div>
          </div>

          <!-- Features card -->
          <div class="card border-0 shadow-sm rounded-4 mt-4">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-3">🔧 Auth Features Active</h6>
              <ul class="list-unstyled small">
                <li class="mb-1">✅ JWT Authentication (15 min expiry)</li>
                <li class="mb-1">✅ Refresh Token (7 day cookie)</li>
                <li class="mb-1">✅ Auto silent refresh (1 min before expiry)</li>
                <li class="mb-1">✅ Role-based access control (Admin / User)</li>
                <li class="mb-1">✅ Fake backend — all requests mocked in browser</li>
                <li class="mb-1 {{ isAdmin ? 'text-success' : 'text-muted' }}">
                  {{ isAdmin ? '✅' : '🔒' }} Admin Panel ({{ isAdmin ? 'you have access' : 'Admin role required' }})
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 3px solid rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: 700;
      color: white;
    }
  `]
})
export class HomeComponent {
  account: Account | null;
  get isAdmin() { return this.account?.role === Role.Admin; }

  constructor(private accountService: AccountService) {
    this.account = this.accountService.accountValue;
  }
}
