export class Item {
    id: number;
    name: string;
    itemTypeId: number;
    formatId: number;
    statusId: number;

    settingId?: number;
    seriesId?: number;
    numberInSeries?: number;
    seriesLength?: number;
    rulesetId?: number;

    persons?: string[];
    publishers?: string[];
    genres?: string[];

    itemType?: string;
    format?: string;
    status?: string;
    setting?: string;
    series?: string;
    ruleset?: string;

}