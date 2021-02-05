import { Component, OnInit } from '@angular/core';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { TotalData } from 'src/app/models/total-data';
import { DataServiceService } from 'src/app/services/data-service.service';

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

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(globalDataSummary => {
      this.data = globalDataSummary
      this.data.forEach(globalData => {
        if (globalData.country != undefined) {
          this.countries.push(globalData.country)
        }
      })
    })

    this.dataService.getDateWiseData().subscribe(result => {
      this.dateWiseData = result
    })
  }

  selectCountry(selectedCountry: string){
    this.data.forEach(dataRow => {
      if (dataRow.country == selectedCountry) {
        if(!Number.isNaN(dataRow.confirmed)){
          this.totalData.totalActive += dataRow.active
          this.totalData.totalConfirmed += dataRow.confirmed
          this.totalData.totalDeaths += dataRow.deaths
          this.totalData.totalRecovered += dataRow.recovered
        }
      }
    })

    this.selectedCountryData = this.dateWiseData[selectedCountry]
    
    
  }

}
