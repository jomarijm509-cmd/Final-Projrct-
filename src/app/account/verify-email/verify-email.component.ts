import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { CommonModule } from '@angular/common';

enum EmailStatus { Verifying, Success, Failed }

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="text-center py-3">
      <!-- Verifying -->
      <div *ngIf="emailStatus === EmailStatus.Verifying">
        <span class="spinner-border text-primary mb-3 d-block mx-auto" style="width:2.5rem;height:2.5rem"></span>
        <h6 class="fw-bold">Verifying your email…</h6>
        <p class="text-muted small">Please wait a moment.</p>
      </div>

      <!-- Success -->
      <div *ngIf="emailStatus === EmailStatus.Success">
        <div class="text-success fs-1 mb-3">✅</div>
        <h6 class="fw-bold text-success">Email Verified!</h6>
        <p class="text-muted small">Your account is now active. Redirecting you to login…</p>
      </div>

      <!-- Failed -->
      <div *ngIf="emailStatus === EmailStatus.Failed">
        <div class="text-danger fs-1 mb-3">❌</div>
        <h6 class="fw-bold text-danger">Verification Failed</h6>
        <p class="text-muted small mb-3">
          The link may have expired or already been used.
          Try using the forgot password flow to re-verify.
        </p>
        <a routerLink="/account/forgot-password" class="btn btn-outline-primary btn-sm">Forgot Password / Re-verify</a>
      </div>
    </div>
    <hr class="my-4" />
    <p class="text-center small mb-0">
      <a routerLink="/account/login" class="text-decoration-none">← Back to Sign In</a>
    </p>
  `
})
export class VerifyEmailComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    this.accountService.verifyEmail(token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.emailStatus = EmailStatus.Success;
          this.alertService.success(
            '🎉 Email verified successfully! You can now sign in.',
            { keepAfterRouteChange: true }
          );
          setTimeout(() => this.router.navigate(['/account/login']), 2000);
        },
        error: () => { this.emailStatus = EmailStatus.Failed; }
      });
  }
}
