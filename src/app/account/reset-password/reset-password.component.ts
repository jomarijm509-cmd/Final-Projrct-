import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { mustMatchValidator } from '@app/_helpers';
import { CommonModule } from '@angular/common';

enum TokenStatus { Validating, Valid, Invalid }

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h5 class="fw-bold mb-1 text-center">Reset Password</h5>
    <p class="text-muted text-center small mb-4">Enter a new password for your account.</p>

    <!-- Validating -->
    <div *ngIf="tokenStatus === TokenStatus.Validating" class="text-center py-4">
      <span class="spinner-border text-primary me-2"></span>
      Validating reset token…
    </div>

    <!-- Invalid token -->
    <div *ngIf="tokenStatus === TokenStatus.Invalid" class="text-center py-4">
      <div class="text-danger fs-1 mb-3">❌</div>
      <h6 class="fw-bold text-danger">Token Validation Failed</h6>
      <p class="text-muted small">This link may have expired or already been used.</p>
      <a routerLink="/account/forgot-password" class="btn btn-outline-primary btn-sm">Request New Link</a>
    </div>

    <!-- Valid — show form -->
    <div *ngIf="tokenStatus === TokenStatus.Valid">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label class="form-label fw-semibold">New Password</label>
          <input type="password" formControlName="password" class="form-control" placeholder="Min. 6 characters"
                 [ngClass]="{ 'is-invalid': submitted && f['password'].errors }" />
          <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
            <span *ngIf="f['password'].errors['required']">Password is required</span>
            <span *ngIf="f['password'].errors['minlength']">Min. 6 characters</span>
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label fw-semibold">Confirm Password</label>
          <input type="password" formControlName="confirmPassword" class="form-control" placeholder="Repeat new password"
                 [ngClass]="{ 'is-invalid': submitted && f['confirmPassword'].errors }" />
          <div *ngIf="submitted && f['confirmPassword'].errors" class="invalid-feedback">
            <span *ngIf="f['confirmPassword'].errors['required']">Please confirm your password</span>
            <span *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords do not match</span>
          </div>
        </div>
        <button [disabled]="loading" class="btn btn-success w-100 py-2">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Resetting…' : 'Set New Password' }}
        </button>
      </form>
    </div>

    <hr class="my-4" />
    <p class="text-center small mb-0">
      <a routerLink="/account/login" class="text-decoration-none">← Back to Sign In</a>
    </p>
  `
})
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token!: string;
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: mustMatchValidator('password', 'confirmPassword') });

    this.accountService.validateResetToken(this.token)
      .pipe(first())
      .subscribe({
        next: () => { this.tokenStatus = TokenStatus.Valid; },
        error: () => { this.tokenStatus = TokenStatus.Invalid; }
      });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Password reset successful — please sign in with your new password.', { keepAfterRouteChange: true });
          this.router.navigate(['/account/login']);
        },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }
}
