import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserHomeComponent } from './components/user-home/user-home.component';

import { NurseryService } from './services/nursery.service';
import { ShopService } from './services/shop.service'

import { NurserySpecificationComponent } from './components/nursery-specification/nursery-specification.component';
import { SeedlingComponent } from './components/seedling/seedling.component';
import { SeedlingSpecificationComponent } from './components/seedling-specification/seedling-specification.component';
import { ShopComponent } from './components/shop/shop.component';


const routes: Routes = [
  { path: '', component: LogInComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserHomeComponent},
  { path: 'user/nursery/:id', component: NurserySpecificationComponent},
  { path: 'user/shop', component: ShopComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegisterComponent,
    NavbarComponent,
    UserHomeComponent,
    NurserySpecificationComponent,
    SeedlingComponent,
    SeedlingSpecificationComponent,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    NurseryService,
    ShopService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
