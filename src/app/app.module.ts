import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiObjectSelectionComponent } from './multi-object-select/multi-object-select.component';
import { MultiObjectSelectionChipComponent } from './multi-object-select/multi-object-chips/multi-object-chips.component';
import { MultiObjectDropdownComponent } from './multi-object-select/multi-object-dropdown/multi-object-dropdown.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SamplePopoverComponent } from './sample/sample-popover/sample-popover.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiObjectSelectionComponent,
    MultiObjectSelectionChipComponent,
    MultiObjectDropdownComponent,
    SamplePopoverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
