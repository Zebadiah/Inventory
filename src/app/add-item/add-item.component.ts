import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { InventoryService } from '../inventory.service';
import { SimpleItemDetail } from '../itemdetail';
import { Item } from '../item';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.sass']
})

export class AddItemComponent implements OnInit {
  availableTypes: SimpleItemDetail[] = [];
  availableSerieses: SimpleItemDetail[] = [];
  availablePersons: SimpleItemDetail[] = [];
  availablePublishers: SimpleItemDetail[] = [];
  availableFormats: SimpleItemDetail[] = [];
  availableSettings: SimpleItemDetail[] = [];
  availableGenres: SimpleItemDetail[] = [];
  availableRulesets: SimpleItemDetail[] = [];
  availableStatuses: SimpleItemDetail[] = [];

  selectedPeople: string[] = [];
  selectedPublishers: string[] = [];
  selectedGenres: string[] = [];

  addForm = new FormGroup(
    {
      selectedType: new FormControl(''),
      selectedTitle: new FormControl(''),
      selectedSeries: new FormControl(''),
      selectedNumberInSeries: new FormControl(''),
      selectedSeriesLength: new FormControl(''),
      selectedPerson: new FormControl(''),
      selectedPublisher: new FormControl(''),
      selectedFormat: new FormControl(''),
      selectedSetting: new FormControl(''),
      selectedGenre: new FormControl(''),
      selectedRuleset: new FormControl(''),
      selectedStatus: new FormControl('')
    }
  );

  constructor(private iService: InventoryService) { }

  ngOnInit() {
    this.iService.getTypes()
      .subscribe(results => this.availableTypes = results);

    this.iService.getStatuses()
      .subscribe(results => this.availableStatuses = results);
  }

  changeType(): void {
    const setType: string = this.addForm.controls.selectedType.value;

    this.reset();
    this.addForm.controls.selectedType.setValue(setType);

    if(this.addForm.controls.selectedType.value !== '') {
      this.iService.getSeriesByType(eval(setType))
        .subscribe(results => this.availableSerieses = results);

      this.iService.getPersonsByType(eval(setType))
      .subscribe(results => this.availablePersons = results);

      this.iService.getPublishersByType(eval(setType))
        .subscribe(results => this.availablePublishers = results);

      this.iService.getFormatsByType(eval(setType))
        .subscribe(results => this.availableFormats = results);

      this.iService.getSettingsByType(eval(setType))
        .subscribe(results => this.availableSettings = results);

      this.iService.getGenresByType(eval(setType))
        .subscribe(results => this.availableGenres = results);

      this.iService.getRulesetsByType(eval(setType))
        .subscribe(results => this.availableRulesets = results);
      } else {
      this.availableSerieses = [];
      this.availablePersons = [];
      this.availablePublishers = [];
      this.availableFormats = [];
      this.availableSettings = [];
      this.availableGenres = [];
      this.availableRulesets = [];
      }
  }

  addItem(): void {
    const fe = this.addForm.controls;

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
      if(this.availableFormats[z].name === this.addForm.controls.selectedFormat.value) {
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
          eval(this.addForm.controls.selectedType.value), 
          this.addForm.controls.selectedFormat.value)
          .subscribe(newId => newFormatId = newId);
        this.availableFormats.push({ id: newFormatId, name: this.addForm.controls.selectedFormat.value });
        formatIndex = this.availableFormats.length-1;
      }

      let pendingItem: Item = {
        id: 0,
        itemTypeId: eval(this.addForm.controls.selectedType.value),
        itemType: this.availableTypes[typeIndex].name,
        name: this.addForm.controls.selectedTitle.value,
        formatId: this.availableFormats[formatIndex].id,
        format: this.availableFormats[formatIndex].name,
        statusId: eval(this.addForm.controls.selectedStatus.value),
        status: this.availableStatuses[statusIndex].name
      };

      this.iService.addItem(pendingItem);
      this.reset();
    }
    else {
      console.log("failed to add because: ");
      if(typeIndex == -1) { console.log("type not found", fe.selectedType.value)};
      if(statusIndex == -1) { console.log("status not found", fe.selectedStatus.value)};
      if(fe.selectedTitle.value == "") { console.log("title required", fe.selectedTitle.value)}
    }
  };

  reset(): void {
    this.addForm.reset();
    this.addForm.controls.selectedType.setValue('');
    this.addForm.controls.selectedSeries.setValue('');
    this.addForm.controls.selectedStatus.setValue('');

    this.availableSerieses = [];
    this.availablePersons = [];
    this.availablePublishers = [];
    this.availableFormats = [];
    this.availableSettings = [];
    this.availableGenres = [];
    this.availableRulesets = [];
  };
}
