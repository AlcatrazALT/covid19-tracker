import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { TotalData } from 'src/app/models/total-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalData: TotalData = {
    totalConfirmed: 0,
    totalActive: 0,
    totalDeaths: 0,
    totalRecovered: 0
  }

  globalData: GlobalDataSummary[] = []

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: (globalDataSummary) => {
          this.globalData = globalDataSummary
          globalDataSummary.forEach(globalData => {
            if(globalData.active != undefined && globalData.confirmed != undefined && globalData.deaths != undefined && globalData.recovered != undefined && !Number.isNaN(globalData.confirmed)){
              this.totalData.totalActive += globalData.active
              this.totalData.totalConfirmed += globalData.confirmed
              this.totalData.totalDeaths += globalData.deaths
              this.totalData.totalRecovered += globalData.recovered
            }
          })
        }
      }
    )
  }
}