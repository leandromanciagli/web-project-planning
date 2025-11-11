import { Component, OnInit } from '@angular/core';
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
    }

    // Subscribirse al estado de login
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.sections = this.authService.getSectionsByRoles();
      } else {
        this.sections = [];
      }
    });

    // Obtener la ruta actual
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

}
