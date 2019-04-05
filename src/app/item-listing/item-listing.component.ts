import { Component, OnInit } from '@angular/core';

import { InventoryService } from '../inventory.service';
import { Item } from '../item';

@Component({
  selector: 'app-item-listing',
  templateUrl: './item-listing.component.html',
  styleUrls: ['./item-listing.component.scss']
})
export class ItemListingComponent implements OnInit {

  items: Item[] = [];

  constructor(private iService: InventoryService) { }

  ngOnInit() {
    this.iService.getItems()
      .subscribe(items => this.items = items);
  }

}
