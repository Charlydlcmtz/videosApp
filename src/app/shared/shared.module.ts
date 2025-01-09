import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component';
import { FooterMenuComponent } from './components/footer-menu/footer-menu.component';
import { HeaderNotAuthMenuComponent } from './components/header-not-auth-menu/header-not-auth-menu.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderMenuComponent,
    FooterMenuComponent,
    HeaderNotAuthMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports:[
    HeaderMenuComponent,
    FooterMenuComponent,
    HeaderNotAuthMenuComponent,
  ]
})
export class SharedModule { }
