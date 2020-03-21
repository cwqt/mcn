import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm:FormGroup;
  loading:boolean = false;
  success:boolean = false;

  constructor(
    private userService:UserService,
    private fb:FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ["", [ Validators.required ]],
      email: ["", [ Validators.required ]],
      password: ["", [ Validators.required, ]],
    });
  }

  get username() { return this.registerForm.get("username") }
  get email() { return this.registerForm.get("email") }
  get password() { return this.registerForm.get("password") }

  submitHandler() {
    this.loading = true;
    this.userService.logIn(this.registerForm.value).subscribe(
      res => {
        this.success = true;
      },
      err => {
        this.success = false;
      },
      () => { this.loading = false; }
    )
  }
}
