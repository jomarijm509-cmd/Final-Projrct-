import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-bg d-flex align-items-center min-vh-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div class="text-center mb-4">
              <span class="display-6">🔐</span>
              <h4 class="fw-bold text-dark mt-1">Auth Boilerplate</h4>
              <p class="text-muted small">Angular 21 + JWT + Bootstrap 5</p>
            </div>
            <div class="card shadow border-0 rounded-4">
              <div class="card-body p-4 p-md-5">
                <router-outlet></router-outlet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router, private accountService: AccountService) {}
  ngOnInit() {
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }
  }
}
