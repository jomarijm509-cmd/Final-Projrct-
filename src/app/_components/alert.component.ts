import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from '@app/_models';
import { AlertService } from '@app/_services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let alert of alerts" class="alert-wrapper">
      <div class="alert alert-dismissible mb-0 shadow-sm"
           role="alert"
           [ngClass]="cssClasses(alert)"
           [class.fade]="alert.fade">
        <button type="button" class="btn-close" (click)="removeAlert(alert)"></button>
        <span [innerHTML]="alert.message"></span>
      </div>
    </div>
  `,
  styles: [`
    .alert-wrapper {
      position: relative;
      z-index: 1050;
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  private alertSub!: Subscription;
  private routeSub!: Subscription;

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    this.alertSub = this.alertService.onAlert(this.id).subscribe(alert => {
      if (!alert.message) {
        // clear alerts that don't have keepAfterRouteChange set
        this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
        this.alerts.forEach(x => delete x.keepAfterRouteChange);
        return;
      }
      this.alerts.push(alert);
      if (alert.autoClose) {
        setTimeout(() => this.removeAlert(alert), 3000);
      }
    });

    // clear on route change
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.alertSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) return;
    if (this.fade) {
      const a = this.alerts.find(x => x === alert);
      if (a) a.fade = true;
      setTimeout(() => { this.alerts = this.alerts.filter(x => x !== alert); }, 250);
    } else {
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClasses(alert: Alert): { [key: string]: boolean } {
    return {
      'alert-success': alert.type === AlertType.Success,
      'alert-danger':  alert.type === AlertType.Error,
      'alert-info':    alert.type === AlertType.Info,
      'alert-warning': alert.type === AlertType.Warning,
      'show':          !alert.fade,
    };
  }
}
