import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import FIELD_ID from '@salesforce/schema/Merchandise__c.Id';
import FIELD_NAME from '@salesforce/schema/Merchandise__c.Name';
import FIELD_PICTURE from '@salesforce/schema/Merchandise__c.Picture_URL__c';

const fields = [FIELD_ID, FIELD_NAME, FIELD_PICTURE];

export default class MerchandisePicture extends LightningElement {
    @api recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    })
    record;

    get name() {
        return getFieldValue(this.record.data, FIELD_NAME);
    }

    get pictureUrl() {
        return getFieldValue(this.record.data, FIELD_PICTURE);
    }
}
