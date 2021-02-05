import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { merge } from 'rxjs';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { TotalData } from 'src/app/models/total-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[] = []
  countries: string [] = []

  totalData: TotalData = {
    totalConfirmed: 0,
    totalActive: 0,
    totalDeaths: 0,
    totalRecovered: 0
  }

  dateWiseData = {}
  selectedCountryData: DateWiseData[]

  lineChartData = []
  lineChartType: ChartType = ChartType.LineChart
  lineChartColumns = ["Date", "Cases"]
  lineChartOptions = {
    height: 500,
    width: 600,
    animation: {
      duration: 1000,
      easing: 'out'
    }
  }

  loading = true
  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.dataService.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result
        })
      ), 
      this.dataService.getGlobalData().pipe(
        map(result => {
          this.data = result
          this.data.forEach(cs => {
            this.countries.push(cs.country)
          })
        })
      )
    ).subscribe({
      complete: () => {
        this.selectCountry(this.countries[0])
        this.loading = false
      }
    })
  }

  selectCountry(selectedCountry: string){
    this.data.forEach(dataRow => {
      if (dataRow.country == selectedCountry) {
        this.totalData.totalActive += dataRow.active
        this.totalData.totalConfirmed += dataRow.confirmed
        this.totalData.totalDeaths += dataRow.deaths
        this.totalData.totalRecovered += dataRow.recovered
      }
    })

    this.selectedCountryData = this.dateWiseData[selectedCountry]

    this.updateLineChart()
  }

  updateLineChart(){
    let dataTable = []
    this.selectedCountryData.forEach(cs=>{
      dataTable.push([cs.date, cs.cases])
    })

    this.lineChartData = dataTable
  }
}
