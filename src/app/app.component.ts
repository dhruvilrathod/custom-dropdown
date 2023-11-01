import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http/http.service';
import { DataRequester } from './multi-object-select/interfaces/multi-object-selection.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  title = 'custom-dropdown';

  public loading: boolean = false;

  public dataToPass!: any;

  public preSelectedChips: any[] = [];

  public sectionDataToPass:any;

  constructor(
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this._httpService.getData().subscribe({
      next: (value) => {
        this.dataToPass = value;
        // this.sectionDataToPass = {
        //   allowSectionSelection: true,
        //   sectionId: 11,
        //   sectionTooltipKey: 'tooool',
        //   sectionNameKey: 'section 1211',
        // }
      },
      error: (err) => { console.log(err); },
      complete: () => {

        this._httpService.getPreselected().subscribe({
          next: (data: any) => { this.preSelectedChips = data },
          error: (err) => { console.log(err); },
          complete: () => {
            this.loading = false;
          }
        });

      }
    })
  }


  public onChipAdd(e: any) {
    console.log('received event for onChipAdd:', e);
  }
  public onChipRemove(e: any) {
    console.log('received event for onChipRemove:', e);
  }
  public onChipClick(e: any) {
    console.log('received event for onChipClick:', e);
  }
  public onQuerySeach(e: any) {
    console.log('received event for onQuerySeach:', e);
  }
  public onReset(e: any) {
    console.log('received event for onReset:', e);
  }
  public onSelectAll(e: any) {
    console.log('received event for onSelectAll:', e);
  }

  loadChildren(requestData: DataRequester): void {

    let endPoint = `data${requestData.preparedData.optionData!.levelIndex! + 1}`

    this._httpService.getData2(endPoint).subscribe({
      next: (data: any) => { requestData.onResult(data) },
      error: (err: any) => { requestData.onError && requestData.onError(err) },

    })

  }

  searchValue(requestData: DataRequester) {

    //cancel any ongonig search call
    this._httpService.getSearchResults().subscribe({
      next: (data) => { requestData.onResult(data) },
      error: () => { requestData.onError!() }
    })
  }

}
