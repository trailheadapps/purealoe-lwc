import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import FIELD_STATUS from '@salesforce/schema/Harvest_Field__c.Status__c';

const fields = [FIELD_STATUS];

export default class Alert extends LightningElement {
    @api recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    })
    record;

    get isAlert() {
        return getFieldValue(this.record.data, FIELD_STATUS) === 'Alert';
    }

    get isWarning() {
        return getFieldValue(this.record.data, FIELD_STATUS) === 'Warning';
    }
}
