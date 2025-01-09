import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'header-menu',
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent implements OnInit {

  private authService = inject( AuthService );
  public email: string | null ='';
  public searchInput = new FormControl('');
  private router = inject( Router );
  public currentIcon = 'fa-solid fa-magnifying-glass';

  ngOnInit(): void {
    this.email = localStorage.getItem('user');
  }

  onLogout(){
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
    });
  }

  onSearch(){
    const title: string = this.searchInput.value || '';
    if ( title != '') {
      return this.router.navigateByUrl(`/videos/search/${title}`);

    }
    return this.router.navigateByUrl(`/videos/list`);
  }

}
