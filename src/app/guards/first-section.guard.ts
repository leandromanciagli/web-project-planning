import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class FirstSectionGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const firstSection = this.auth.getFirstAvailableSection();
        this.router.navigate(['/app', firstSection], { replaceUrl: true });
        return false;
    }
}

