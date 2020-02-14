import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import FIELD_ID from '@salesforce/schema/Harvest_Field__c.Id';
import FIELD_NAME from '@salesforce/schema/Harvest_Field__c.Name';
import FIELD_STATUS from '@salesforce/schema/Harvest_Field__c.Status__c';
import FIELD_IRRIGATION from '@salesforce/schema/Harvest_Field__c.Irrigation__c';
import FIELD_IRRIGATION_OVERRIDES from '@salesforce/schema/Harvest_Field__c.Irrigation_Overrides__c';

const fields = [
    FIELD_ID,
    FIELD_NAME,
    FIELD_STATUS,
    FIELD_IRRIGATION,
    FIELD_IRRIGATION_OVERRIDES
];

export default class IrrigationManager extends LightningElement {
    //Flow input properties
    @api duration;
    @api recordId;
    @api startTime;

    //Flow output property
    @api addedMsgText;

    messageText;

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    })
    harvestRecord;

    //Flow output property
    @api
    get overrideCount() {
        return getFieldValue(
            this.harvestRecord.data,
            FIELD_IRRIGATION_OVERRIDES
        );
    }

    @api
    get defaultMsg() {
        const name = getFieldValue(this.harvestRecord.data, FIELD_NAME);
        return (
            'Alert! Irrigation for ' +
            name +
            ' will begin at ' +
            this.startTime +
            ', and is scheduled to last ' +
            this.duration +
            ' minutes.'
        );
    }

    handleStartTimeChange(event) {
        const attributeChangeEvent = new FlowAttributeChangeEvent(
            'startTime',
            event.target.value
        );
        this.dispatchEvent(attributeChangeEvent);
    }

    handleDurationChange(event) {
        const attributeChangeEvent = new FlowAttributeChangeEvent(
            'duration',
            event.target.value
        );
        this.dispatchEvent(attributeChangeEvent);
    }

    handleMessageChange(event) {
        this.messageText = event.target.value;
        const attributeChangeEvent = new FlowAttributeChangeEvent(
            'addedMsgText',
            event.target.value
        );
        this.dispatchEvent(attributeChangeEvent);
    }
}
