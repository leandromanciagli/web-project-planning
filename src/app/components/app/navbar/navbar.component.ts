import { Component, OnInit } from '@angular/core';
import { AuthService } from '@/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '@/models/user.model';

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
  user: User;
  sections: { id: number, name: string, route: string, color: string, availableRoles: string[] }[]

  constructor(protected authService: AuthService, private router: Router) { 
    this.user = this.authService.getUser();
    this.sections = [
      { id: 1, name: 'Mis Proyectos', route: '/my-projects', color: 'bg-indigo-600', availableRoles: ['ONG_PRINCIPAL'] },
      { id: 2, name: 'Colaboraciones', route: '/collaborations', color: 'bg-[#059669]', availableRoles: ['ONG_COLABORADORA'] },
      { id: 3, name: 'Monitoreo y Seguimiento', route: '/monitoring', color: 'bg-orange-500', availableRoles: ['ONG_GERENCIAL'] }
    ];
  }

  ngOnInit(): void {
    // Subscribirse al estado de login
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Obtener la ruta actual
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

}
