import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { mustMatchValidator } from '@app/_helpers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h5 class="fw-bold mb-1 text-center">Create an account</h5>
    <p class="text-muted text-center small mb-4">Fill in the details below to register</p>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label fw-semibold">Title</label>
        <select formControlName="title" class="form-select"
                [ngClass]="{ 'is-invalid': submitted && f['title'].errors }">
          <option value="">Select title…</option>
          <option>Mr</option>
          <option>Mrs</option>
          <option>Miss</option>
          <option>Ms</option>
          <option>Dr</option>
        </select>
        <div *ngIf="submitted && f['title'].errors" class="invalid-feedback">Title is required</div>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label fw-semibold">First Name</label>
          <input formControlName="firstName" class="form-control" placeholder="Jane"
                 [ngClass]="{ 'is-invalid': submitted && f['firstName'].errors }" />
          <div *ngIf="submitted && f['firstName'].errors" class="invalid-feedback">Required</div>
        </div>
        <div class="col-6">
          <label class="form-label fw-semibold">Last Name</label>
          <input formControlName="lastName" class="form-control" placeholder="Doe"
                 [ngClass]="{ 'is-invalid': submitted && f['lastName'].errors }" />
          <div *ngIf="submitted && f['lastName'].errors" class="invalid-feedback">Required</div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input type="email" formControlName="email" class="form-control" placeholder="you@example.com"
               [ngClass]="{ 'is-invalid': submitted && f['email'].errors }" />
        <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
          <span *ngIf="f['email'].errors['required']">Email is required</span>
          <span *ngIf="f['email'].errors['email']">Enter a valid email</span>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Password</label>
        <input type="password" formControlName="password" class="form-control" placeholder="Min. 6 characters"
               [ngClass]="{ 'is-invalid': submitted && f['password'].errors }" />
        <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
          <span *ngIf="f['password'].errors['required']">Password is required</span>
          <span *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</span>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Confirm Password</label>
        <input type="password" formControlName="confirmPassword" class="form-control" placeholder="Repeat password"
               [ngClass]="{ 'is-invalid': submitted && f['confirmPassword'].errors }" />
        <div *ngIf="submitted && f['confirmPassword'].errors" class="invalid-feedback">
          <span *ngIf="f['confirmPassword'].errors['required']">Confirm password is required</span>
          <span *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords do not match</span>
        </div>
      </div>

      <div class="mb-4">
        <div class="form-check">
          <input type="checkbox" formControlName="acceptTerms" id="acceptTerms" class="form-check-input"
                 [ngClass]="{ 'is-invalid': submitted && f['acceptTerms'].errors }" />
          <label class="form-check-label small" for="acceptTerms">
            I accept the <a href="#" class="text-decoration-none">Terms &amp; Conditions</a>
          </label>
          <div *ngIf="submitted && f['acceptTerms'].errors" class="invalid-feedback">
            You must accept the terms and conditions
          </div>
        </div>
      </div>

      <button [disabled]="loading" class="btn btn-primary w-100 py-2">
        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
        <span>{{ loading ? 'Creating account…' : 'Create Account' }}</span>
      </button>
    </form>

    <hr class="my-4" />
    <p class="text-center small mb-0">
      Already have an account? <a routerLink="/account/login" class="fw-semibold text-decoration-none">Sign in</a>
    </p>
    <p class="text-center small mt-2 text-muted">
      <span class="badge bg-warning text-dark">ℹ️ First account registered = Admin role</span>
    </p>
  `
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: mustMatchValidator('password', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success(
            'Registration successful! Check the on-screen "email" above to verify your account.',
            { keepAfterRouteChange: true }
          );
          this.router.navigate(['/account/login']);
        },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }
}
