import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserHomeComponent } from './components/user-home/user-home.component';

import { NurseryService } from './services/nursery.service';
import { ShopService } from './services/shop.service';
import { WarehouseService } from './services/warehouse.service';
import { CompanyService } from './services/company.service';
import { AuthenticationService } from './services/authentication.service';

import { NurserySpecificationComponent } from './components/nursery-specification/nursery-specification.component';
import { SeedlingComponent } from './components/seedling/seedling.component';
import { SeedlingSpecificationComponent } from './components/seedling-specification/seedling-specification.component';
import { ShopComponent } from './components/shop/shop.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { ProductSpecificationComponent } from './components/product-specification/product-specification.component';
import { CompanyHomeComponent } from './components/company-home/company-home.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { OrderChartComponent } from './components/order-chart/order-chart.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserGuard } from './guards/user_guard';
import { CompanyGuard } from './guards/company_guard';
import { AdminGuard } from './guards/admin_guard';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { RecaptchaModule } from 'ng-recaptcha';

const routes: Routes = [
  { path: '', component: LogInComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserHomeComponent, canActivate:[UserGuard]},
  { path: 'user/nursery/dashboard', component: NurserySpecificationComponent, canActivate:[UserGuard]},
  { path: 'user/nursery/shop', component: ShopComponent, canActivate:[UserGuard]},
  { path: 'user/nursery/warehouse', component: WarehouseComponent, canActivate:[UserGuard]},
  { path: 'user/nursery/shop/product', component: ProductSpecificationComponent, canActivate:[UserGuard]},
  { path: 'company/shop/product', component: ProductSpecificationComponent, canActivate:[CompanyGuard]},
  { path: 'company', component: CompanyHomeComponent, canActivate:[CompanyGuard]},
  { path: 'company/my-products', component: MyProductsComponent, canActivate:[CompanyGuard]},
  { path: 'company/chart', component: OrderChartComponent, canActivate:[CompanyGuard]},
  { path: 'admin', component: AdminHomeComponent, canActivate:[AdminGuard]},
  { path: 'admin/users', component: AdminUsersComponent, canActivate:[AdminGuard]},
  { path: 'company/change-password', component: ChangePasswordComponent, canActivate:[CompanyGuard]},
  { path: 'admin/change-password', component: ChangePasswordComponent, canActivate:[AdminGuard]},
  { path: 'user/change-password', component: ChangePasswordComponent, canActivate:[UserGuard]}
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
    ShopComponent,
    WarehouseComponent,
    ProductSpecificationComponent,
    CompanyHomeComponent,
    MyProductsComponent,
    OrderChartComponent,
    AdminHomeComponent,
    AdminUsersComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RecaptchaModule
  ],
  providers: [
    NurseryService,
    ShopService,
    WarehouseService,
    CompanyService,
    AuthenticationService,
    UserGuard,
    CompanyGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
