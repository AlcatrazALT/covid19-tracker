import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
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

  pieChartData = []
  pieChartType: ChartType = ChartType.PieChart
  pieChartColumns = ["Country", "Cases"]
  pieChartOptions = {
    height: 500
  }

  columnsChartData = []
  columnsChartType: ChartType = ChartType.ColumnChart
  columnsChartColumns = ["Country", "Cases"]
  columnsChartOptions = {
    height: 500,
    width: 500
  }
  private showConfirmedValue = 2000
  constructor(private dataService: DataServiceService) { }

  initChart(){
    let dataTable = []
    this.globalData.forEach(cs=>{
      if(cs.confirmed > this.showConfirmedValue){
        dataTable.push([cs.country, cs.confirmed])
      }
    })
    this.pieChartData = dataTable
    this.columnsChartData = dataTable
  }

  ngOnInit(): void {
    this.dataService.getGlobalData()
      .subscribe(
        {
          next: (result) => {
            this.globalData = result;
            result.forEach(cs => {
              if (!Number.isNaN(cs.confirmed)) {
                this.totalData.totalActive += cs.active
                this.totalData.totalConfirmed += cs.confirmed
                this.totalData.totalDeaths += cs.deaths
                this.totalData.totalRecovered += cs.active
              }
            })
            this.initChart()
          }
        }
      )
  }
}