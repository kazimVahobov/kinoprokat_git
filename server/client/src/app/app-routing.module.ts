import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutModule} from './layout/layout.module';
import {LoginModule} from './login/login.module';

const routes: Routes = [
  {path: '', loadChildren: () => LayoutModule},
  {path: 'login', loadChildren: () => LoginModule},
  { path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
