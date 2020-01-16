import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  authUser: User;
  @Input() snav: MatSidenav;

  drawerLinks: Array<{ icon: string, route: string[], title: string }> = [
    {icon: 'home', route: ['/'], title: 'Home'},
    {icon: 'collections_bookmark', route: ['/my-games'], title: 'Mi Librería'},
    {icon: 'cloud_download', route: ['/request-game'], title: 'Crear Petición de Juego'},
    {icon: 'person', route: ['/user-data'], title: 'Datos de Usuario'},
  ];

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((routeData: {authUser: User}) => {
      this.authUser = routeData.authUser;
      this.drawerLinks.push(
        {icon: 'supervised_user_circle', route: [`/user/${this.authUser.nickname}`], title: 'Mi Perfil'},
      );
      
      if (this.authUser && this.authUser.admin) {
        this.drawerLinks.push(
          {icon: 'videogame_asset', route: ['/add-game'], title: 'Añadir Juego'},
          {icon: 'cloud_download', route: ['/pending-games'], title: 'Juegos Pendientes'}
        );
      }
    });
  }

  closeSideNav(): void {
    this.snav.close();
  }

  openSidenav(): void {
    setTimeout(() => {
      this.snav.open();
    }, 10);
  }

}
