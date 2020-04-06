import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { reduceErrors } from 'c/ldsUtils';
import {
    getRecord,
    updateRecord,
    generateRecordInputForUpdate,
    getFieldValue
} from 'lightning/uiRecordApi';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import FIELD_ID from '@salesforce/schema/Harvest_Field__c.Id';
import FIELD_NAME from '@salesforce/schema/Harvest_Field__c.Name';
import FIELD_CROP from '@salesforce/schema/Harvest_Field__c.Crop__c';
import FIELD_SIZE from '@salesforce/schema/Harvest_Field__c.Size__c';
import FIELD_STATUS from '@salesforce/schema/Harvest_Field__c.Status__c';
import FIELD_YIELD from '@salesforce/schema/Harvest_Field__c.Yield__c';
import FIELD_MAP_ID from '@salesforce/schema/Harvest_Field__c.Map_Id__c';
import FIELD_IRRIGATION from '@salesforce/schema/Harvest_Field__c.Irrigation__c';
import FIELD_PICTURE_URL from '@salesforce/schema/Harvest_Field__c.Picture_URL__c';
import PICTURES_PUREALOE from '@salesforce/resourceUrl/purealoe';

const fields = [
    FIELD_ID,
    FIELD_NAME,
    FIELD_CROP,
    FIELD_SIZE,
    FIELD_STATUS,
    FIELD_YIELD,
    FIELD_MAP_ID,
    FIELD_IRRIGATION,
    FIELD_PICTURE_URL
];

export default class HarvestField extends NavigationMixin(LightningElement) {
    error;
    harvestField;
    imageStatus;
    recordId;

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    })
    wiredRecord({ error, data }) {
        if (error) {
            this.error = error;
            this.harvestField = undefined;
        } else if (data) {
            this.error = undefined;
            this.imageStatus =
                PICTURES_PUREALOE +
                '/ground_' +
                getFieldValue(data, FIELD_STATUS) +
                '.png';
            this.harvestField = data;
        }
    }

    _harvestColumns = [
        { label: 'Date', fieldName: 'harvestDate', type: 'text' },
        { label: 'Qty', fieldName: 'qty', type: 'text' },
        { label: 'Supervisor', fieldName: 'supervisor', type: 'text' }
    ];
    _harvests = [
        { harvestDate: '09/09/2017', qty: '354 lbs', supervisor: 'Nelson' },
        { harvestDate: '08/05/2017', qty: '301 lbs', supervisor: 'Nelson' },
        { harvestDate: '09/10/2016', qty: '299 lbs', supervisor: 'Nelson' },
        { harvestDate: '09/09/2015', qty: '354 lbs', supervisor: 'Nelson' }
    ];
    _irrigationColumns = [
        { label: 'When', fieldName: 'when', type: 'text' },
        { label: 'Duration', fieldName: 'duration', type: 'text' },
        { label: 'Volume', fieldName: 'volume', type: 'text' }
    ];
    _irrigationHistory = [
        { when: '12 hours ago', duration: '60 minutes', volume: '10 liters' },
        { when: '18 hours ago', duration: '30 minutes', volume: '5 liters' }
    ];

    connectedCallback() {
        registerListener(
            'purealoe__fieldselected',
            this.handleRecordChanged,
            this
        );
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    get harvestName() {
        return getFieldValue(this.harvestField, FIELD_NAME);
    }

    get harvestCrop() {
        return getFieldValue(this.harvestField, FIELD_CROP);
    }

    get harvestIrrigation() {
        return getFieldValue(this.harvestField, FIELD_IRRIGATION);
    }

    get harvestPicture() {
        return getFieldValue(this.harvestField, FIELD_PICTURE_URL);
    }

    get harvestSize() {
        return getFieldValue(this.harvestField, FIELD_SIZE);
    }

    get harvestStatus() {
        return getFieldValue(this.harvestField, FIELD_STATUS);
    }

    get harvestYield() {
        return getFieldValue(this.harvestField, FIELD_YIELD);
    }

    get harvests() {
        return this._harvests;
    }
    get harvestColumns() {
        return this._harvestColumns;
    }

    get irrigationColumns() {
        return this._irrigationColumns;
    }

    get irrigationHistory() {
        return this._irrigationHistory;
    }

    get isAlert() {
        return getFieldValue(this.harvestField, FIELD_STATUS) === 'Alert';
    }

    get isWarning() {
        return getFieldValue(this.harvestField, FIELD_STATUS) === 'Warning';
    }

    handleToggleChange(event) {
        let recordUpdate = generateRecordInputForUpdate(this.harvestField);
        recordUpdate.fields.Irrigation__c = event.target.checked;
        updateRecord(recordUpdate)
            // eslint-disable-next-line no-unused-vars
            .then((result) => {
                // leave here, not needed
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error on data save',
                        message: reduceErrors(error).join(', '),
                        variant: 'error'
                    })
                );
            });
    }

    handleNavigateToRecordHome() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: this.recordId
            }
        });
    }

    handleRecordChanged(recordId) {
        this.recordId = recordId;
    }
}
