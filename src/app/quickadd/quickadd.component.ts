import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { InventoryService } from '../inventory.service';
import { SimpleItemDetail } from '../itemdetail';
import { Item } from '../item';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { EventListener } from '@angular/core/src/debug/debug_node';

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
      selectedType: new FormControl({value: '', disabled: false }, Validators.required),
      selectedTitle: new FormControl({value: '', disabled: true }, Validators.required),
      selectedFormat: new FormControl({value: '', disabled: true }, Validators.required),
      selectedStatus: new FormControl({value: '', disabled: true }, Validators.required)
    }
  );

  constructor(private iService: InventoryService,
    private location: Location) { }

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
      this.quickAddForm.controls.selectedTitle.enable();
      this.quickAddForm.controls.selectedFormat.enable();
      this.quickAddForm.controls.selectedStatus.enable();

      this.subscriptions.add(
        this.iService.getFormatsByType(eval(this.quickAddForm.controls.selectedType.value))
          .subscribe(formats => this.availableFormats = formats)
      );
    } else {
      this.availableFormats = [];
    }
  }

  addItem(): void {
    let fe = this.quickAddForm.controls;

    let typeIndex: number = this.availableTypes.findIndex(types => types.id === eval(fe.selectedType.value));
    let statusIndex: number = this.availableStatuses.findIndex(statuses => statuses.id === eval(fe.selectedStatus.value));
    let formatIndex: number = this.availableFormats.findIndex(formats => formats.name == fe.selectedFormat.value);

    if(typeIndex !== -1 && statusIndex !== -1 && fe.selectedTitle.value !== "") {
      // add format if not already in list
      // get newly added format id
      // this is wrong
      if(formatIndex === -1) {
        let newFormatId: number;
        this.subscriptions.add(
          this.iService.addFormatForType(
            eval(fe.selectedType.value), 
            fe.selectedFormat.value)
              .subscribe(newId => newFormatId = newId)
        );
        this.availableFormats.push({ id: newFormatId, name: fe.selectedFormat.value });
        formatIndex = this.availableFormats.length-1
      }

      let pendingItem: Item = {
        id: 0,
        itemTypeId: eval(fe.selectedType.value),
        itemType: this.availableTypes[typeIndex].name,
        name: fe.selectedTitle.value,
        formatId: this.availableFormats[formatIndex].id,
        format: this.availableFormats[formatIndex].name,
        statusId: eval(fe.selectedStatus.value),
        status: this.availableStatuses[statusIndex].name
      };

      this.iService.addItem(pendingItem);

      this.quickAddForm.reset();
      fe.selectedType.setValue('');
      fe.selectedStatus.setValue('');
    }
    else {
      console.log("failed to add because: ");
      if(typeIndex == -1) { console.log("type not found", fe.selectedType.value)};
      if(statusIndex == -1) { console.log("status not found", fe.selectedStatus.value)};
      if(fe.selectedTitle.value == "") { console.log("title required", fe.selectedTitle.value)}
    }

  }

  reset(): void {
    this.quickAddForm.reset();
    this.quickAddForm.controls.selectedType.setValue('');
    this.quickAddForm.controls.selectedFormat.setValue('');
    this.quickAddForm.controls.selectedStatus.setValue('');

    this.availableFormats = [];
  };

  back(): void {
    this.location.back();
  }
}
