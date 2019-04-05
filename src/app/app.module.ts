import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { QuickaddComponent } from './quickadd/quickadd.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { SearchComponent } from './search/search.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemListingComponent } from './item-listing/item-listing.component';
import { EditItemComponent } from './edit-item/edit-item.component';

@NgModule({
  declarations: [
    AppComponent,
    QuickaddComponent,
    ItemDetailComponent,
    SearchComponent,
    AddItemComponent,
    ItemListingComponent,
    EditItemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
