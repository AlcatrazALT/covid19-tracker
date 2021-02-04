import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0
  totalActive = 0
  totalDeaths = 0
  totalRecovered = 0
  globalData: GlobalDataSummary[] = []

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: (result) => {
          debugger
          result.forEach(cs => {
            this.globalData = cs
            cs.forEach(item => {
              if(item.active != undefined && item.confirmed != undefined && item.deaths != undefined && item.recovered != undefined && !Number.isNaN(item.confirmed)){
                this.totalActive += item.active
                this.totalConfirmed += item.confirmed
                this.totalDeaths += item.deaths
                this.totalRecovered += item.recovered
              }
            })
          })
        }
      }
    )
  }
}