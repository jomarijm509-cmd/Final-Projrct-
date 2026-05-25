import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { mustMatchValidator } from '@app/_helpers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h5 class="fw-bold mb-4">Update Profile</h5>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label fw-semibold">Title</label>
          <select formControlName="title" class="form-select"
                  [ngClass]="{ 'is-invalid': submitted && f['title'].errors }">
            <option value="">Select…</option>
            <option>Mr</option><option>Mrs</option><option>Miss</option>
            <option>Ms</option><option>Dr</option>
          </select>
          <div *ngIf="submitted && f['title'].errors" class="invalid-feedback">Required</div>
        </div>
        <div class="col-md-4half col-sm-6">
          <label class="form-label fw-semibold">First Name</label>
          <input formControlName="firstName" class="form-control"
                 [ngClass]="{ 'is-invalid': submitted && f['firstName'].errors }" />
          <div *ngIf="submitted && f['firstName'].errors" class="invalid-feedback">Required</div>
        </div>
        <div class="col-md-4half col-sm-6">
          <label class="form-label fw-semibold">Last Name</label>
          <input formControlName="lastName" class="form-control"
                 [ngClass]="{ 'is-invalid': submitted && f['lastName'].errors }" />
          <div *ngIf="submitted && f['lastName'].errors" class="invalid-feedback">Required</div>
        </div>
        <div class="col-12">
          <label class="form-label fw-semibold">Email</label>
          <input type="email" formControlName="email" class="form-control"
                 [ngClass]="{ 'is-invalid': submitted && f['email'].errors }" />
          <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">Valid email required</div>
        </div>

        <div class="col-12"><hr />
          <p class="text-muted small mb-3">
            <strong>Change Password</strong> — leave blank to keep current password
          </p>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold">New Password</label>
          <input type="password" formControlName="password" class="form-control" placeholder="Min. 6 characters"
                 [ngClass]="{ 'is-invalid': submitted && f['password'].errors }" />
          <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
            <span *ngIf="f['password'].errors['minlength']">Min 6 characters</span>
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold">Confirm Password</label>
          <input type="password" formControlName="confirmPassword" class="form-control"
                 [ngClass]="{ 'is-invalid': submitted && f['confirmPassword'].errors }" />
          <div *ngIf="submitted && f['confirmPassword'].errors" class="invalid-feedback">
            <span *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords must match</span>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <div class="d-flex gap-2">
          <button [disabled]="loading" class="btn btn-primary">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Saving…' : '💾 Save Changes' }}
          </button>
          <a routerLink="/profile" class="btn btn-outline-secondary">Cancel</a>
        </div>
        <button type="button" class="btn btn-outline-danger btn-sm"
                (click)="onDelete()" [disabled]="deleting">
          <span *ngIf="deleting" class="spinner-border spinner-border-sm me-1"></span>
          🗑️ Delete Account
        </button>
      </div>
    </form>
  `
})
export class UpdateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  deleting = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const acc = this.accountService.accountValue!;
    this.form = this.fb.group({
      title: [acc.title, Validators.required],
      firstName: [acc.firstName, Validators.required],
      lastName: [acc.lastName, Validators.required],
      email: [acc.email, [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      confirmPassword: ['']
    }, { validators: mustMatchValidator('password', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;
    this.loading = true;
    this.accountService.update(this.accountService.accountValue!.id!, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Profile updated successfully', { keepAfterRouteChange: true });
          this.router.navigate(['/profile']);
        },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }

  onDelete() {
    if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
    this.deleting = true;
    this.accountService.delete(this.accountService.accountValue!.id!)
      .pipe(first())
      .subscribe({
        error: err => {
          this.alertService.error(err);
          this.deleting = false;
        }
      });
  }
}
