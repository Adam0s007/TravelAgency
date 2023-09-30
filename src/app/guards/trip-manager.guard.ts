import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AuthService} from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class TripManagerGuard implements CanActivate {
  constructor(private router: Router,private afAuth:AngularFireAuth,private AuthService:AuthService) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve,reject)=>{
      this.afAuth.onAuthStateChanged((user)=>{
        if(user && (this.AuthService.myUserRole.admin ||this.AuthService.myUserRole.manager)){
          resolve(true);
        }else{
          this.router.navigate(['/home']);
          resolve(false);
        }
      })
    });
  }
  
}
