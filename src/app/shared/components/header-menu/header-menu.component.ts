import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'header-menu',
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent implements OnInit {

  private fb = inject( FormBuilder );
  public email: string | null ='';

  public buscarForm: FormGroup = this.fb.group({
    title: new FormControl<string>('', { nonNullable: true }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.email = localStorage.getItem('user');
  }

  onLogout(){
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
    });
  }

  onSearch(){
    const { title } = this.buscarForm.value;
    const titulo_video = title;
    if ( titulo_video != '') {
      return this.router.navigateByUrl(`/videos/search/${titulo_video}`);

    }
    return this.router.navigateByUrl(`/videos/list`);
  }

}
