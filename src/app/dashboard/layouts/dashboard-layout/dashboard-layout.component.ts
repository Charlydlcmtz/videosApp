import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

  public email: string | null = '';

  ngOnInit(): any {
    // Verifica si estás en un entorno de navegador
    if (typeof window === 'undefined') {
      console.error('No se puede acceder a localStorage fuera del navegador.');
      return of(undefined); // Devuelve un observable vacío
    }

      this.email = localStorage.getItem('user');

  }

}
