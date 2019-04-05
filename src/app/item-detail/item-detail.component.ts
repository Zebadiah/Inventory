import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InventoryService } from '../inventory.service';
import { Item } from '../item';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  item: Item;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private iService: InventoryService
  ) { }

  ngOnInit() {
    const selectedItemId: number = eval(this.route.snapshot.paramMap.get('id'));

    this.iService.getItemById(selectedItemId)
      .subscribe(item => this.item = item);
  }

  back(): void {
    this.location.back();
  }
}