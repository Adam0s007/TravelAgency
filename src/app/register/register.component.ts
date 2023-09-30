import { Component, OnInit} from '@angular/core';
import {  AbstractControl, NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/compat/auth';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private AuthService:AuthService,private router:Router,private afAuth:AngularFireAuth){}
  
  isLoading = false;
  error: string|null = null;
  signUpForm:FormGroup = new FormGroup({});
  firebaseErrorMessage:string = '';


  ngOnInit(){
    this.signUpForm = new FormGroup({
      'email': new FormControl('',[Validators.required,Validators.email]),
      'password': new FormControl('',Validators.required),
      'passwordConfirmation': new FormControl('',[Validators.required,this.samePasswords.bind(this)])
    });
  }

signUp(){
  if(this.signUpForm.invalid){
    return;
  }
  this.isLoading = true;
  this.AuthService.signUp(this.signUpForm.value).then((result)=>{
    this.isLoading = false;
    if(result == null) this.router.navigate(['/home']);
    else if(result.isValid == false) this.firebaseErrorMessage = result.message;
    this.signUpForm.reset();
  }).catch((error)=>{
    this.isLoading = false;
    console.log("some error")
  })
}

samePasswords(control:AbstractControl):{[s:string]: boolean}|null{
  if(this.signUpForm.value.password !== control.value)
  return {'forbiddenNumber':true}
 
   return null
}


}


