import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiObjectSelectionComponent } from './multi-object-select/multi-object-select.component';
import { MultiObjectSelectionChipComponent } from './multi-object-select/multi-object-chips/multi-object-chips.component';
import { MultiObjectDropdownComponent } from './multi-object-select/multi-object-dropdown/multi-object-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiObjectSelectionComponent,
    MultiObjectSelectionChipComponent,
    MultiObjectDropdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
