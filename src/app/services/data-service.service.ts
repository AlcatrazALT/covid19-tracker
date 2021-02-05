import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { result } from 'lodash';
import {map} from 'rxjs/operators';
import { DateWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private readonly globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-01-2020.csv`
  private readonly dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
  
  constructor(private http: HttpClient) { }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(response => {
        let data: GlobalDataSummary[] = []
        
        let rows = response.split('\n')
        rows.splice(0, 1)// remove header
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          }
          
          data.push(cs)
        })

        const groupedDataByCountry = _(data)
          .groupBy(row => row.country)
          .map((obj, key) => ({
            country: key,
            confirmed: _.sumBy(obj, cases => cases.confirmed),
            deaths: _.sumBy(obj, cases => cases.deaths),
            recovered: _.sumBy(obj, cases => cases.recovered),
            active: _.sumBy(obj, cases => cases.active)
          })).value()

        const values = Object.values(groupedDataByCountry)
        const result = values.reduce((acc, value) => acc.concat(value), [])

        return result;
      })
    )
  }

  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl, {responseType: 'text'})
    .pipe(map(result => {
      let rows = result.split('\n')
      let header = rows[0]
      rows.splice(0, 1)

      let dates = header.split(/,(?=\S)/)
      dates.splice(0, 4)

      let mainData = {}
      rows.forEach(row => {
        let cols = row.split(/,(?=\S)/)
        let countryName = cols[1]
        cols.splice(0, 4)

        mainData[countryName] = []

        cols.forEach((value, index) => {
          let dateWiseDate : DateWiseData = {
            cases: +value,
            country: countryName,
            date: new Date(Date.parse(dates[index]))
          }

          mainData[countryName].push(dateWiseDate)
        })
      })
      
      return mainData
    }))
  }
}
