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
    width: 600
  }

  private showConfirmedValue = 2000
  private showActiveValue = 2000
  private showRecoveredValue = 2000
  private showDeathsValue = 1000

  confirmedInputValue = 'confirmed'
  deathsInputValue = 'deaths'
  recoveredInputValue = 'recovered'
  activeInputValue = 'active'

  constructor(private dataService: DataServiceService) { }

  initChart(caseType:string){

    let dataTable = []
    this.globalData.forEach(cs=>{
      let value:number = 0
      switch (caseType) {
        case this.confirmedInputValue:
          if(cs.confirmed > this.showConfirmedValue){
            value = cs.confirmed
          }
          break;
        case this.deathsInputValue:
          if(cs.deaths > this.showDeathsValue){
            value = cs.deaths
          }
          break;
        case this.recoveredInputValue:
          if(cs.recovered > this.showRecoveredValue){
            value = cs.recovered
          }
          break;
        case this.activeInputValue:
          if(cs.active > this.showActiveValue){
            value = cs.active
          }
          break;
      }

      dataTable.push([cs.country, value])

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
            this.initChart(this.confirmedInputValue)
          }
        }
      )
  }

  updateChart(input: HTMLInputElement){
    const caseType = input.value
    this.initChart(caseType)
  }
}