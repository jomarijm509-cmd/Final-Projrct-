import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h5 class="fw-bold mb-1 text-center">Welcome back</h5>
    <p class="text-muted text-center small mb-4">Sign in to your account</p>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label fw-semibold">Email address</label>
        <input type="email" formControlName="email" class="form-control"
               placeholder="you@example.com"
               [ngClass]="{ 'is-invalid': submitted && f['email'].errors }" />
        <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
          <span *ngIf="f['email'].errors['required']">Email is required</span>
          <span *ngIf="f['email'].errors['email']">Enter a valid email address</span>
        </div>
      </div>

      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <label class="form-label fw-semibold">Password</label>
          <a routerLink="/account/forgot-password" class="small text-decoration-none">Forgot password?</a>
        </div>
        <input type="password" formControlName="password" class="form-control"
               placeholder="••••••••"
               [ngClass]="{ 'is-invalid': submitted && f['password'].errors }" />
        <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">Password is required</div>
      </div>

      <button [disabled]="loading" class="btn btn-primary w-100 py-2 mt-1">
        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
        <span *ngIf="!loading">Sign In</span>
        <span *ngIf="loading">Signing in…</span>
      </button>
    </form>

    <hr class="my-4" />
    <p class="text-center small mb-0">
      Don't have an account? <a routerLink="/account/register" class="fw-semibold text-decoration-none">Create one</a>
    </p>
  `
})
export class LoginComponent implements OnInit {
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
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.login(this.f['email'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }
}
