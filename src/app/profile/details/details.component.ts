import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '@app/_services';
import { Account, Role } from '@app/_models';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h5 class="fw-bold mb-4">Profile Details</h5>
    <div *ngIf="account" class="row g-3">
      <div class="col-sm-6">
        <div class="detail-card p-3 rounded-3 bg-light">
          <div class="text-muted small mb-1">Title</div>
          <div class="fw-semibold">{{ account.title || '—' }}</div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="detail-card p-3 rounded-3 bg-light">
          <div class="text-muted small mb-1">Role</div>
          <span class="badge rounded-pill px-3 py-1" [ngClass]="isAdmin ? 'bg-danger' : 'bg-secondary'">
            {{ isAdmin ? '👑 Admin' : '👤 User' }}
          </span>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="detail-card p-3 rounded-3 bg-light">
          <div class="text-muted small mb-1">First Name</div>
          <div class="fw-semibold">{{ account.firstName }}</div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="detail-card p-3 rounded-3 bg-light">
          <div class="text-muted small mb-1">Last Name</div>
          <div class="fw-semibold">{{ account.lastName }}</div>
        </div>
      </div>
      <div class="col-12">
        <div class="detail-card p-3 rounded-3 bg-light">
          <div class="text-muted small mb-1">Email</div>
          <div class="fw-semibold">{{ account.email }}</div>
        </div>
      </div>
      <div class="col-12">
        <div class="detail-card p-3 rounded-3 bg-light">
          <div class="text-muted small mb-1">Account Status</div>
          <span class="badge bg-success">✓ Verified &amp; Active</span>
        </div>
      </div>
      <div class="col-12 mt-2">
        <a routerLink="/profile/update" class="btn btn-primary">✏️ Edit Profile</a>
      </div>
    </div>
  `,
  styles: [`.detail-card { border: 1px solid #e9ecef; }`]
})
export class DetailsComponent {
  account: Account | null;
  get isAdmin() { return this.account?.role === Role.Admin; }
  constructor(private accountService: AccountService) {
    this.account = this.accountService.accountValue;
  }
}
