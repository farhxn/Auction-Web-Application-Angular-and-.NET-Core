import { Routes } from '@angular/router';
import { LayoutComponent as mainLayout } from './main/layout/layout.component';
import { LayoutComponent as dashboardLayout } from './dashboard/layout/layout.component';
import { IndexComponent as mainIndex } from './main/index/index.component';
import { IndexComponent as dashboardIndex } from './dashboard/index/index.component';
import { AuctionListComponent } from './main/auction-list/auction-list.component';
import { AuctionDetailComponent } from './main/auction-detail/auction-detail.component';
import { AboutComponent } from './main/about/about.component';
import { FaqsComponent } from './main/faqs/faqs.component';
import { ContactComponent } from './main/contact/contact.component';
import { LoginComponent } from './main/login/login.component';
import { SignUpComponent } from './main/sign-up/sign-up.component';
import { ErrorPageComponent } from './main/error-page/error-page.component';
import { AddVechileComponent } from './main/add-vechile/add-vechile.component';
import { ForgetComponent } from './main/forget/forget.component';
import { ResetPasswordComponent } from './main/reset-password/reset-password.component';
import { authGuard } from './main/shared/auth.guard';
import { claimReq } from './main/shared/utils/claimReq-utils';
import { UserListComponent } from './dashboard/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    component: mainLayout,
    children: [
      { path: '', component: mainIndex, data: { title: 'Home' } },
      {
        path: 'auction',
        component: AuctionListComponent,
        data: { title: 'Auctions' },
      },
      {
        path: 'auctionDetail/:id',
        component: AuctionDetailComponent,
        data: { title: 'Auction Vehicle Detail' },
      },
      { path: 'about', component: AboutComponent, data: { title: 'About Us' } },
      { path: 'faq', component: FaqsComponent, data: { title: 'FAQs' } },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contact Us' },
      },
      { path: 'login', component: LoginComponent, data: { title: 'Login' } },
      {
        path: 'forgetpassword',
        component: ForgetComponent,
        data: { title: 'Forgot Password' },
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: { title: 'Reset Password' },
      },
      {
        path: 'signup',
        component: SignUpComponent,
        data: { title: 'Sign Up' },
      },
      {
        path: 'auctionVehicle/:id',
        component: AddVechileComponent,
        data: { title: 'Add Vehicle' },
      },
    ],
  },

  {
    path: 'dashboard',
    component: dashboardLayout,
    data: { title: 'Dashboard', claimReq: claimReq.adminOnly },
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'main',
        component: dashboardIndex,
        data: { title: 'Dashboard', claimReq: claimReq.adminOnly },
      },

      {
        path: 'userlist',
        component: UserListComponent,
        data: { title: 'User List', claimReq: claimReq.adminOnly },
      },
    ],
  },

  {
    path: '404',
    component: ErrorPageComponent,
    data: { title: 'Page Not Found' },
  },
  { path: '**', redirectTo: '404' },
];
