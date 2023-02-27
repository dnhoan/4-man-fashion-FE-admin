import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../common-services/jwt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isCollapsed: any;
  constructor(private router: Router, private jwtService: JwtService) {}

  logout() {
    this.jwtService.removeJwtToken();
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {}
}
