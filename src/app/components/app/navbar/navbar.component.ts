import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '@/services/auth.service';
import { NavbarSection } from '@/services/navbar.service';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentRoute: string = '';
  sections: NavbarSection[] = [];
  isSessionMenuOpen = false;
  user: any = null;

  constructor(
    protected authService: AuthService, 
    private router: Router,
  ) { 

  }

  ngOnInit(): void {
    // Inicializar ruta actual
    this.currentRoute = this.router.url;
    
    // Cargar secciones si ya está logueado
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.sections = this.authService.getSectionsByRoles();
      this.user = this.authService.getUser();
    }

    // Subscribirse al estado de login
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.sections = this.authService.getSectionsByRoles();
        this.user = this.authService.getUser();
      } else {
        this.sections = [];
        this.user = null;
      }
    });

    // Obtener la ruta actual
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.session-menu-container')) {
      this.closeSessionMenu();
    }
  }

  toggleSessionMenu(): void {
    this.isSessionMenuOpen = !this.isSessionMenuOpen;
  }

  closeSessionMenu(): void {
    this.isSessionMenuOpen = false;
  }

  logout(): void {
    this.closeSessionMenu();
    this.authService.logout();
  }

  getOrganizationName(): string {
    return this.user?.firstname;
  }

  getRoles(): string[] {
    if (!this.user?.roles || !Array.isArray(this.user.roles)) {
      return [];
    }
    return this.user.roles.map((r: any) => r.displayName || r.name);
  }

}
