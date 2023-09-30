import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TripDataService } from '../services/trip-data.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private AuthService:AuthService,private router:Router,private afAuth:AngularFireAuth){}
  
  isLoading = false;
  error: string|null = null;
  loginForm:FormGroup = new FormGroup({});
  firebaseErrorMessage:string = '';


  ngOnInit(){
    this.loginForm = new FormGroup({
      'email': new FormControl('',[Validators.required,Validators.email]),
      'password': new FormControl('',Validators.required)
    });
  }

logIn(){
  if(this.loginForm.invalid){
    return;
  }
  //console.log('here')
  this.isLoading = true;
  this.AuthService.logIn(this.loginForm.value.email,this.loginForm.value.password).then((result)=>{
    this.isLoading = false;
    if(result == null) {
      this.router.navigate(['/home']);
      
      this.loginForm.reset();
  }
    else if(result.isValid == false) this.firebaseErrorMessage = result.message;
  }).catch((error)=>{
    this.isLoading = false;
    console.log("some error")
  })
}


  onSubmit(form:NgForm){
//     if(!form.valid){
//       return;
//     }
//     const email = form.value.email;
//     const password = form.value.password;
//     this.isLoading = true;
//     this.AuthService.login(email,password).subscribe(resData=>{
//       console.log(resData);
//       this.isLoading = false;
//       this.tripDataService
//       this.router.navigate(['/home'])
//     },errorMessage=>{
//       console.log(errorMessage);
//       this.error = errorMessage;
//       //this.error = "An error occured!";
//       this.isLoading = false;
//     });
// console.log(form.value);
// form.reset();
  }
}
