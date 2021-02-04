import { Component, Input, OnInit } from '@angular/core';
import { TotalData } from 'src/app/models/total-data';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {

  @Input() totalData: TotalData = {
    totalConfirmed: 0,
    totalActive: 0,
    totalDeaths: 0,
    totalRecovered: 0
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
