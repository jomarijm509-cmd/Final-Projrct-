import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { mustMatchValidator } from '@app/_helpers';
import { Role } from '@app/_models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">{{ isAddMode ? '➕ Add Account' : '✏️ Edit Account' }}</h4>
      <a routerLink="/admin/accounts" class="btn btn-outline-secondary btn-sm">← Back to List</a>
    </div>

    <div class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">
            <div class="col-md-2">
              <label class="form-label fw-semibold">Title</label>
              <select formControlName="title" class="form-select"
                      [ngClass]="{ 'is-invalid': submitted && f['title'].errors }">
                <option value="">Select…</option>
                <option>Mr</option><option>Mrs</option><option>Miss</option>
                <option>Ms</option><option>Dr</option>
              </select>
              <div *ngIf="submitted && f['title'].errors" class="invalid-feedback">Required</div>
            </div>
            <div class="col-md-5">
              <label class="form-label fw-semibold">First Name</label>
              <input formControlName="firstName" class="form-control"
                     [ngClass]="{ 'is-invalid': submitted && f['firstName'].errors }" />
              <div *ngIf="submitted && f['firstName'].errors" class="invalid-feedback">Required</div>
            </div>
            <div class="col-md-5">
              <label class="form-label fw-semibold">Last Name</label>
              <input formControlName="lastName" class="form-control"
                     [ngClass]="{ 'is-invalid': submitted && f['lastName'].errors }" />
              <div *ngIf="submitted && f['lastName'].errors" class="invalid-feedback">Required</div>
            </div>
            <div class="col-md-7">
              <label class="form-label fw-semibold">Email</label>
              <input type="email" formControlName="email" class="form-control"
                     [ngClass]="{ 'is-invalid': submitted && f['email'].errors }" />
              <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">Valid email required</div>
            </div>
            <div class="col-md-5">
              <label class="form-label fw-semibold">Role</label>
              <select formControlName="role" class="form-select"
                      [ngClass]="{ 'is-invalid': submitted && f['role'].errors }">
                <option [value]="Role.User">👤 User</option>
                <option [value]="Role.Admin">👑 Admin</option>
              </select>
              <div *ngIf="submitted && f['role'].errors" class="invalid-feedback">Required</div>
            </div>
          </div>

          <hr class="my-4" />
          <h6 class="fw-semibold mb-3">
            Password
            <span *ngIf="!isAddMode" class="text-muted fw-normal small">(leave blank to keep current)</span>
          </h6>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">New Password</label>
              <input type="password" formControlName="password" class="form-control"
                     placeholder="{{ isAddMode ? 'Required' : 'Leave blank to keep current' }}"
                     [ngClass]="{ 'is-invalid': submitted && f['password'].errors }" />
              <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                <span *ngIf="f['password'].errors['required']">Password is required</span>
                <span *ngIf="f['password'].errors['minlength']">Min. 6 characters</span>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Confirm Password</label>
              <input type="password" formControlName="confirmPassword" class="form-control"
                     [ngClass]="{ 'is-invalid': submitted && f['confirmPassword'].errors }" />
              <div *ngIf="submitted && f['confirmPassword'].errors" class="invalid-feedback">
                <span *ngIf="f['confirmPassword'].errors['required']">Required</span>
                <span *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords must match</span>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button [disabled]="loading" class="btn btn-primary px-4">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Saving…' : (isAddMode ? 'Create Account' : 'Save Changes') }}
            </button>
            <a routerLink="/admin/accounts" class="btn btn-outline-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddEditComponent implements OnInit {
  Role = Role;
  form!: FormGroup;
  id?: string;
  isAddMode!: boolean;
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
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) passwordValidators.push(Validators.required);

    this.form = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [Role.User, Validators.required],
      password: ['', passwordValidators],
      confirmPassword: ['']
    }, { validators: mustMatchValidator('password', 'confirmPassword') });

    if (!this.isAddMode) {
      this.accountService.getById(this.id!)
        .pipe(first())
        .subscribe(account => this.form.patchValue(account));
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;
    this.loading = true;
    this.isAddMode ? this.createAccount() : this.updateAccount();
  }

  private createAccount() {
    this.accountService.create(this.form.value).pipe(first()).subscribe({
      next: () => {
        this.alertService.success('Account created successfully', { keepAfterRouteChange: true });
        this.router.navigate(['/admin/accounts']);
      },
      error: err => { this.alertService.error(err); this.loading = false; }
    });
  }

  private updateAccount() {
    this.accountService.update(this.id!, this.form.value).pipe(first()).subscribe({
      next: () => {
        this.alertService.success('Account updated successfully', { keepAfterRouteChange: true });
        this.router.navigate(['/admin/accounts']);
      },
      error: err => { this.alertService.error(err); this.loading = false; }
    });
  }
}
