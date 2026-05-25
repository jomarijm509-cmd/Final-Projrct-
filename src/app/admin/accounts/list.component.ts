import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Account, Role } from '@app/_models';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">👥 All Accounts</h4>
      <a routerLink="/admin/accounts/add" class="btn btn-success">
        ➕ Add Account
      </a>
    </div>

    <!-- Loading -->
    <div *ngIf="!accounts" class="text-center py-5">
      <span class="spinner-border text-primary mb-3 d-block mx-auto"></span>
      <p class="text-muted">Loading accounts…</p>
    </div>

    <!-- Table -->
    <div *ngIf="accounts" class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th class="px-4 py-3">#</th>
              <th class="py-3">Name</th>
              <th class="py-3">Email</th>
              <th class="py-3">Role</th>
              <th class="py-3">Status</th>
              <th class="py-3 text-end px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts; let i = index">
              <td class="px-4 text-muted small">{{ i + 1 }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                       style="width:36px;height:36px;font-size:.75rem;font-weight:700">
                    {{ account.firstName?.charAt(0) }}{{ account.lastName?.charAt(0) }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ account.title }} {{ account.firstName }} {{ account.lastName }}</div>
                  </div>
                </div>
              </td>
              <td class="text-muted">{{ account.email }}</td>
              <td>
                <span class="badge rounded-pill px-3"
                      [ngClass]="account.role === 'Admin' ? 'bg-danger' : 'bg-secondary'">
                  {{ account.role === 'Admin' ? '👑 Admin' : '👤 User' }}
                </span>
              </td>
              <td>
                <span class="badge rounded-pill px-3"
                      [ngClass]="account['isVerified'] ? 'bg-success' : 'bg-warning text-dark'">
                  {{ account['isVerified'] ? '✓ Verified' : '⏳ Pending' }}
                </span>
              </td>
              <td class="text-end px-4">
                <a [routerLink]="['/admin/accounts/edit', account.id]"
                   class="btn btn-outline-primary btn-sm me-1">
                  ✏️ Edit
                </a>
                <button (click)="deleteAccount(account)"
                        [disabled]="account.isDeleting"
                        class="btn btn-outline-danger btn-sm">
                  <span *ngIf="account.isDeleting" class="spinner-border spinner-border-sm"></span>
                  <span *ngIf="!account.isDeleting">🗑️</span>
                </button>
              </td>
            </tr>
            <tr *ngIf="accounts.length === 0">
              <td colspan="6" class="text-center text-muted py-5">No accounts found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ListComponent implements OnInit {
  accounts?: Account[];

  constructor(private accountService: AccountService, private alertService: AlertService) {}

  ngOnInit() {
    this.accountService.getAll().pipe(first())
      .subscribe(accounts => this.accounts = accounts);
  }

  deleteAccount(account: Account) {
    if (!confirm(`Delete ${account.firstName} ${account.lastName}? This cannot be undone.`)) return;
    account.isDeleting = true;
    this.accountService.delete(account.id!).pipe(first()).subscribe({
      next: () => {
        this.accounts = this.accounts!.filter(x => x.id !== account.id);
        this.alertService.success('Account deleted');
      },
      error: err => {
        this.alertService.error(err);
        account.isDeleting = false;
      }
    });
  }
}
