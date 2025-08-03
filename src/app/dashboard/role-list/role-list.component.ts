import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { User } from '../shared/model/user';
import { AuthServiceService } from '../../main/service/auth-service.service';
import Swal from 'sweetalert2';
import { Role } from '../shared/model/role';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-role-list',
  imports: [RouterLink, CommonModule, NgxSkeletonLoaderComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
})
export class RoleListComponent implements OnInit {
  roleList: Role[] = [];
  TableLoaded = false;
  skeletonArray = Array(5);
  dataTableInitialized = false;
  selectedUser: any = null;
  renderTable = true;

  constructor(
    private router: Router,
    private auth: AuthServiceService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getList();
  }


  openUserModal(user: Role) {
    this.selectedUser = user;
  }

  confirmDelete(id: string, name: string) {
    Swal.fire({
      title: 'Are you sure?',
      html: `${name} account will be permanently deleted.<br><strong>This action cannot be undone.</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.deleteRole(id).subscribe({
          next: () => {
            this.dataTableInitialized = false;
            this.getList();

            this.getList();
            Swal.fire(
              'Deleted!',
              `${name}'s account has been deleted.`,
              'success'
            );
          },
          error: (err) => {
            Swal.fire(
              'Error',
              'There was an error deleting the user.',
              'error'
            );
          },
        });
      } else {
        Swal.fire('Cancelled', `${name}'s account is safe.`, 'info');
      }
    });
  }

  getList() {
    this.renderTable = false;
    if ($.fn.DataTable.isDataTable('#myTable')) {
      ($('#myTable') as any).DataTable().destroy();
      this.dataTableInitialized = false;
    }

    this.auth.getAllRoles().subscribe({
      next: (data: any) => {
        this.roleList = data.data.map((role: any) => ({
          ...role,
          name: role.name.charAt(0).toUpperCase() + role.name.slice(1),
        }));
        this.TableLoaded = true;

        setTimeout(() => {
          this.renderTable = true;
          setTimeout(() => this.rebuildDataTable(), 100);
        }, 0);
      },
      error: (err) => {
        this.toast.error('Error fetching roles data');
        this.TableLoaded = true;
        console.log('Error fetching roles data:', err);

      },
    });
  }

  rebuildDataTable() {
    if (
      this.roleList &&
      this.roleList.length > 0 &&
      !this.dataTableInitialized
    ) {
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#myTable')) {
          ($('#myTable') as any).DataTable().destroy();
        }
        ($('#myTable') as any).DataTable();
        this.dataTableInitialized = true;
      }, 100);
    }
  }
}
