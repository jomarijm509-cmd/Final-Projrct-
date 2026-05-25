import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h5 class="fw-bold mb-1 text-center">Forgot Password?</h5>
    <p class="text-muted text-center small mb-4">Enter your email and we'll send reset instructions.</p>

    <ng-container *ngIf="!submitted">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="form-label fw-semibold">Email address</label>
          <input type="email" formControlName="email" class="form-control" placeholder="you@example.com"
                 [ngClass]="{ 'is-invalid': formSubmitted && f['email'].errors }" />
          <div *ngIf="formSubmitted && f['email'].errors" class="invalid-feedback">
            <span *ngIf="f['email'].errors['required']">Email is required</span>
            <span *ngIf="f['email'].errors['email']">Enter a valid email</span>
          </div>
        </div>
        <button [disabled]="loading" class="btn btn-primary w-100 py-2">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Sending…' : 'Send Reset Link' }}
        </button>
      </form>
    </ng-container>

    <div *ngIf="submitted" class="text-center py-2">
      <div class="text-success fs-1 mb-3">✅</div>
      <h6 class="fw-bold">Check your email</h6>
      <p class="text-muted small">We've sent reset instructions. Check the on-screen "email" above.</p>
    </div>

    <hr class="my-4" />
    <p class="text-center small mb-0">
      <a routerLink="/account/login" class="text-decoration-none">← Back to Sign In</a>
    </p>
  `
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.formSubmitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.forgotPassword(this.f['email'].value)
      .pipe(first())
      .subscribe({
        next: () => { this.submitted = true; this.loading = false; },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }
}
