import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
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
    @api duration;
    @api ldsRecId;
    @api defaultMsg;
    @api overrideCount;
    @api startTime;

    @track messageText;

    @wire(getRecord, {
        recordId: '$ldsRecId',
        fields
    })
    harvestRecord;

    handleStartTimeChange(event) {
        const changeEvent = new CustomEvent('flowdatachanged', {
            detail: { startTime: event.target.value }
        });
        this.dispatchEvent(changeEvent);
    }

    handleDurationChange(event) {
        const changeEvent = new CustomEvent('flowdatachanged', {
            detail: { duration: event.target.value }
        });
        this.dispatchEvent(changeEvent);
    }

    handleMessageChange(event) {
        this.messageText = event.target.value;
        const changeEvent = new CustomEvent('flowdatachanged', {
            detail: { addedMsgText: event.target.value }
        });
        this.dispatchEvent(changeEvent);
    }
}
