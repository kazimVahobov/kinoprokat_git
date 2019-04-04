import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, UserService} from '../core';

declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  model: { userName: string, password: string };
  messages: string[] = [];

  constructor(private authTokenService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    document.body.className = 'hold-transition login-page';
    this.authTokenService.clearToken();
    this.model = {userName: '', password: ''};
  }

  login() {
    this.userService.login(this.model.userName, this.model.password).subscribe(
      res => {
        this.authTokenService.setAuthData(res);
        this.router.navigate(['/']);
      },
      err => {
        this.messages = [err.error.message || err.message];
      }
    );
  }

  ngAfterViewInit(): void {
    $(() => {
      $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' /* optional */
      });
    });
  }

}
