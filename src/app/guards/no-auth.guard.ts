import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.auth.isLoggedIn()) {
            const firstSection = this.auth.getFirstAvailableSection();
            this.router.navigate(['/app', firstSection]);
            return false;
        }
        return true;
    }
}

