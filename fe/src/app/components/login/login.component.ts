import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loading:boolean = false;
  success:boolean = false;
  errors = {
    'email': "",
    'password': "",
    'form': ""
  }


  constructor(
    private authService:AuthenticationService,
    private fb:FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [ Validators.required ]],
      password: ["", [ Validators.required, ]],
      rememberMe: [false],
    });
  }

  get email() { return this.loginForm.get("email") }
  get password() { return this.loginForm.get("password") }

  submitHandler() {
    this.loading = true;
    setTimeout(() => {


    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.success = true;
      },
      err => {
        this.success = false;
        let errors = err.error.message;
        Object.keys(this.errors).forEach(e => {
          let i = errors.findIndex(x => x.param == e) 
          if(errors[i]) {
            this.errors[e] = errors[i].msg;
            if(errors[i].param != 'form') this.loginForm.controls[e].setErrors({'incorrect': true});
          }
        })
      },
    ).add(() => { this.loading = false;})      
  }, 1000)

  }
}
