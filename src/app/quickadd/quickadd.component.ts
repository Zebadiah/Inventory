import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { InventoryService } from '../inventory.service';
import { SimpleItemDetail } from '../itemdetail';
import { Item } from '../item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quickadd',
  templateUrl: './quickadd.component.html',
  styleUrls: ['./quickadd.component.scss']
})
export class QuickaddComponent implements OnInit, OnDestroy {
  availableTypes: SimpleItemDetail[] = [];
  availableFormats: SimpleItemDetail[] = [];
  availableStatuses: SimpleItemDetail[] = [];
  subscriptions = new Subscription();

  quickAddForm = new FormGroup(
    {
      selectedType: new FormControl(''),
      selectedTitle: new FormControl(''),
      selectedFormat: new FormControl(''),
      selectedStatus: new FormControl('')
    }
  );

  constructor(private iService: InventoryService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.iService.getTypes()
        .subscribe(types => this.availableTypes = types)
    );

    this.subscriptions.add(
    this.iService.getStatuses()
      .subscribe(statuses => this.availableStatuses = statuses)
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  changeType(): void {
    this.quickAddForm.controls.selectedTitle.setValue('');
    this.quickAddForm.controls.selectedFormat.setValue('');
    this.quickAddForm.controls.selectedStatus.setValue('');
    if(this.quickAddForm.controls.selectedType.value !== '') {
      this.iService.getFormatsByType(eval(this.quickAddForm.controls.selectedType.value))
        .subscribe(formats => this.availableFormats = formats);
    } else {
      this.availableFormats = [];
    }
  }

  addItem(): void {
    let fe = this.quickAddForm.controls;

    let typeIndex: number = -1;
    for(let x=0; x<this.availableTypes.length; x++) {
      if(this.availableTypes[x].id === eval(fe.selectedType.value)) {
        typeIndex = x;
        break;
      }
    }

    let statusIndex: number = -1;
    for(let y=0; y<this.availableStatuses.length; y++) {
      if(this.availableStatuses[y].id === eval(fe.selectedStatus.value)) {
        statusIndex = y;
        break;
      }
    }
    
    let formatIndex: number = -1;
    for(let z=0; z<this.availableFormats.length; z++) {
      if(this.availableFormats[z].name === this.quickAddForm.controls.selectedFormat.value) {
        formatIndex = z;
        break;
      }
    }

    if(typeIndex !== -1 && statusIndex !== -1 && fe.selectedTitle.value !== "") {
      // add format if not already in list
      // get newly added format id
      if(formatIndex === -1) {
        let newFormatId: number;
        this.iService.addFormatForType(
          eval(this.quickAddForm.controls.selectedType.value), 
          this.quickAddForm.controls.selectedFormat.value)
          .subscribe(newId => newFormatId = newId);
        this.availableFormats.push({ id: newFormatId, name: this.quickAddForm.controls.selectedFormat.value });
        formatIndex = this.availableFormats.length-1;
      }

      let pendingItem: Item = {
        id: 0,
        itemTypeId: eval(this.quickAddForm.controls.selectedType.value),
        itemType: this.availableTypes[typeIndex].name,
        name: this.quickAddForm.controls.selectedTitle.value,
        formatId: this.availableFormats[formatIndex].id,
        format: this.availableFormats[formatIndex].name,
        statusId: eval(this.quickAddForm.controls.selectedStatus.value),
        status: this.availableStatuses[statusIndex].name
      };

      this.iService.addItem(pendingItem);
      this.quickAddForm.reset();
      this.quickAddForm.controls.selectedType.setValue('');
      this.quickAddForm.controls.selectedStatus.setValue('');

    }
    else {
      console.log("failed to add because: ");
      if(typeIndex == -1) { console.log("type not found", fe.selectedType.value)};
      if(statusIndex == -1) { console.log("status not found", fe.selectedStatus.value)};
      if(fe.selectedTitle.value == "") { console.log("title required", fe.selectedTitle.value)}
    }

  }
}
