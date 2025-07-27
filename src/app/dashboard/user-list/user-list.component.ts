import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../main/service/auth-service.service';
import { User } from '../shared/model/user';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { NotyfService } from '../../shared/notyf.service';

declare var $: any;

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, CommonModule, NgxSkeletonLoaderComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, AfterViewChecked {
  usersList: User[] = [];
  TableLoaded = false;
  skeletonArray = Array(5);
  dataTableInitialized = false;
  selectedUser: any = null;

  constructor(
    private router: Router,
    private auth: AuthServiceService,
    private toast: NotyfService
  ) {}

  ngOnInit(): void {
    this.auth.getAllUsers().subscribe({
      next: (data: any) => {
        this.usersList = data.data as User[];
        console.log('Users fetched successfully:', this.usersList);
        this.TableLoaded = true;
      },
      error: (err) => {
        this.toast.error('Error fetching users data');
        this.TableLoaded = true;
        console.error('Error fetching users:', err);
      },
    });
  }

  ngAfterViewChecked() {
    if (
      this.usersList &&
      this.usersList.length > 0 &&
      !this.dataTableInitialized
    ) {
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#myTable')) {
          ($('#myTable') as any).DataTable().destroy();
        }
        ($('#myTable') as any).DataTable();
        this.dataTableInitialized = true;
      }, 0);
    }
  }

  openUserModal(user: User) {
    this.selectedUser = user;
  }
}
