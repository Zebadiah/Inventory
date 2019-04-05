import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SimpleItemDetail } from './itemdetail';
import { Item } from './item';
import { MOCKDATA } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private rawData = MOCKDATA;
  private items: Item[] = [];

  constructor() { 
    this.items = [{"id":1,"itemTypeId":1,"itemType":"Book","name":"The Fellowship of the Ring","formatId":6,"format":"Paperback","statusId":165,"status":"Owned"},{"id":2,"itemTypeId":1,"itemType":"Book","name":"The Two Towers","formatId":6,"format":"Paperback","statusId":165,"status":"Owned"},{"id":3,"itemTypeId":1,"itemType":"Book","name":"The Return of the King","formatId":6,"format":"Paperback","statusId":165,"status":"Owned"}];
  }

  getItems(): Observable<Item[]> {
    console.log(JSON.stringify(this.items));
    return of(this.items);
  }

  getItemById(passedId: number): Observable<Item> {
    let selectedItem = this.items.find(item => item.id === passedId);
    if(selectedItem !== undefined) {
      return of(selectedItem);
    }
    return of(new Item);
  }

  getTypes(): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(1));
  }

  getStatuses(): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(4));
  }

  getFormatsByType(passedType: number): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(2, passedType));
  }

  addFormatForType(passedType: number, passedValue: string): Observable<number> {
    return of(this.addEntryToData(passedType, 2, passedValue));
  }

  getGenresByType(passedType: number): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(3, passedType));
  }

  addGenreForType(passedType: number, passedValue: string): Observable<number> {
    return of(this.addEntryToData(passedType, 3, passedValue));
  }

  getPersonsByType(passedType: number): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(5, passedType));
  }

  addPersonForType(passedType: number, passedValue: string): Observable<number> {
    return of(this.addEntryToData(passedType, 5, passedValue));
  }

  getPublishersByType(passedType: number): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(6, passedType));
  }

  addPublisherForType(passedType: number, passedValue: string): Observable<number> {
    return of(this.addEntryToData(passedType, 6, passedValue));
  }

  getSettingsByType(passedType: number): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(7, passedType));
  }

  addSettingForType(passedType: number, passedValue: string): Observable<number> {
    return of(this.addEntryToData(passedType, 7, passedValue));
  }

  getSeriesByType(passedType: number): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(8, passedType));
  }

  addSeriesForType(passedType: number, passedValue: string): Observable<number> {
    return of(this.addEntryToData(passedType, 8, passedValue));
  }

  getRulesetsByType(passedType: number): Observable<SimpleItemDetail[]> {
    return of(this.getDataByCategoryAndType(9, passedType));
  }

  addRulesetsByType(passedType: number, passedValue: string): Observable<number> {
    return of(this.addEntryToData(passedType, 9, passedValue));
  }

  addItem(passedItem: Item): void {
    let newId: number = this.items.length > 0 ? this.items[this.items.length-1].id + 1 : 1;
    passedItem.id = newId;
    this.items.push(passedItem);
  }

  private getDataByCategoryAndType(passedCategory: number, passedType: number = 0) : SimpleItemDetail[] {
    // TODO replace with call to db
    let results: SimpleItemDetail[] = [];

    for(let x=0; x<this.rawData.length; x++) {
      if(this.rawData[x].categoryId === passedCategory && (passedType === 0 || this.rawData[x].typeId === passedType) ) {
        results.push(this.rawData[x]);
      }
    }

    console.log(results);
    return results;
  }

  private addEntryToData(passedType: number, passedCategory: number, passedValue: string): number {
    // TODO replace with call to add this to db and return with id
    console.log(this.rawData[this.rawData.length-1]);
    let id: number = this.rawData[this.rawData.length-1].id + 1;

    this.rawData.push({
      id: id,
      name: passedValue, 
      categoryId: passedCategory,
      typeId: passedType
    });

    console.log(this.rawData);

    return id;
  }
}
