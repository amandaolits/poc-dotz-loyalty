import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true, imports: [RouterOutlet, ToastComponent],
  template: `<app-toast></app-toast><router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  ngOnInit(): void { this.auth.init(); }
}
