import { Injectable } from "@angular/core";
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class CompanyGuard implements CanActivate{
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ){}

    canActivate(){
        let user = localStorage.getItem('userInfo');
        if(user != null){
            if(JSON.parse(user).role == 'company') return true;
            this.router.navigate([JSON.parse(user).role])
            return false;
        }
        this.router.navigate([''])
        return false;
    }

}