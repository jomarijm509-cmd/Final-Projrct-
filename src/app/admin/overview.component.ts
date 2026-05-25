import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">🛡️ Admin Overview</h4>
      <span class="badge bg-danger px-3 py-2">Admin Access</span>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4 text-center">
            <div class="fs-1 mb-2">👥</div>
            <div class="display-6 fw-bold text-primary">{{ totalAccounts }}</div>
            <div class="text-muted small">Total Accounts</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4 text-center">
            <div class="fs-1 mb-2">👑</div>
            <div class="display-6 fw-bold text-danger">{{ adminCount }}</div>
            <div class="text-muted small">Admins</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4 text-center">
            <div class="fs-1 mb-2">✅</div>
            <div class="display-6 fw-bold text-success">{{ verifiedCount }}</div>
            <div class="text-muted small">Verified</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4 text-center">
            <div class="fs-1 mb-2">⏳</div>
            <div class="display-6 fw-bold text-warning">{{ pendingCount }}</div>
            <div class="text-muted small">Pending</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <h6 class="fw-bold mb-3">Quick Actions</h6>
        <div class="d-flex gap-2 flex-wrap">
          <a routerLink="/admin/accounts" class="btn btn-primary">👥 Manage Accounts</a>
          <a routerLink="/admin/accounts/add" class="btn btn-success">➕ Add Account</a>
        </div>
      </div>
    </div>
  `
})
export class OverviewComponent implements OnInit {
  totalAccounts = 0;
  adminCount = 0;
  verifiedCount = 0;
  get pendingCount() { return this.totalAccounts - this.verifiedCount; }

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getAll().pipe(first()).subscribe(accounts => {
      this.totalAccounts = accounts.length;
      this.adminCount = accounts.filter((a: any) => a.role === 'Admin').length;
      this.verifiedCount = accounts.filter((a: any) => a.isVerified).length;
    });
  }
}
