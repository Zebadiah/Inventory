import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListingComponent } from './item-listing/item-listing.component';
import { QuickaddComponent } from './quickadd/quickadd.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { SearchComponent } from './search/search.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent},
  { path: 'list', component: ItemListingComponent },
  { path: 'view/:id', component: ItemDetailComponent},
  { path: 'quick', component: QuickaddComponent },
  { path: 'add', component: AddItemComponent },
  { path: 'edit/:id', component: EditItemComponent},
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];
@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
