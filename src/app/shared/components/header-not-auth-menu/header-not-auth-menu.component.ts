import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'header-not-auth-menu',
  templateUrl: './header-not-auth-menu.component.html',
  styleUrl: './header-not-auth-menu.component.css'
})
export class HeaderNotAuthMenuComponent {

  private fb = inject( FormBuilder );

  public buscarForm: FormGroup = this.fb.group({
    title: new FormControl<string>('', { nonNullable: true }),
  });

  constructor(
    private router: Router,
  ){}


  onSearch(){
    const { title } = this.buscarForm.value;
    const titulo_video = title;
    if ( titulo_video != '') {
      return this.router.navigateByUrl(`/videos/search/${titulo_video}`);

    }
    return this.router.navigateByUrl(`/videos/list`);
  }

}
