import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import FIELD_ID from '@salesforce/schema/Harvest_Field__c.Id';
import FIELD_NAME from '@salesforce/schema/Harvest_Field__c.Name';
import FIELD_STATUS from '@salesforce/schema/Harvest_Field__c.Status__c';
import FIELD_MAP_ID from '@salesforce/schema/Harvest_Field__c.Map_Id__c';
import FIELD_IRRIGATION from '@salesforce/schema/Harvest_Field__c.Irrigation__c';

const fields = [
    FIELD_ID,
    FIELD_NAME,
    FIELD_STATUS,
    FIELD_MAP_ID,
    FIELD_IRRIGATION
];

export default class HarvestFieldMap extends LightningElement {
    @api
    set empMessage(value) {
        this._empMessage = value;
        if (value) {
            this.handleEmpMessage();
        }
    }
    get empMessage() {
        return this._empMessage;
    }
    @api harvestFields;
    @api recordId;

    selectedFields = [];
    selectedRecords = [];

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    })
    selectedRecord({ error, data }) {
        if (error) {
            // fail silently
        } else if (data) {
            this.handleRecordUpdated(data);
        }
    }

    _empMessage;
    _isRendered;

    renderedCallback() {
        if (!this._isRendered) {
            // Initialize CSS transform values
            this.template.scale = 1;
            this.template.translateX = 0;
            this.template.translateY = 0;

            this.template.addEventListener('mouseup', (event) => {
                const classList = event.target.classList;
                let fieldId;

                if (classList) {
                    fieldId = classList;
                } else {
                    this.template.mouseDown = false;
                    this.template.dragging = false;
                    return;
                }

                if (this.template.dragging) {
                    this.template.dragging = false;
                } else if (fieldId.value.substring(0, 5) === 'field') {
                    if (!event.shiftKey) {
                        // Unselect fields that are currently selected
                        this.selectedFields.forEach((selectedField) => {
                            selectedField.style.strokeWidth = 0;
                        });
                        this.selectedFields = [];
                        this.selectedRecords = [];
                    }

                    const el = event.target;
                    el.style.stroke = '#FF0000';
                    el.style.strokeWidth = 16;
                    this.selectedFields.push(el);

                    let selectedRecord;
                    const harvestFields = this.harvestFields;
                    for (let i = 0; i < harvestFields.length; i++) {
                        if (
                            fieldId.value ===
                            'field' + harvestFields[i].Map_Id__c
                        ) {
                            selectedRecord = harvestFields[i];
                        }
                    }

                    if (selectedRecord) {
                        this.selectedRecords.push(selectedRecord);

                        this.recordId = selectedRecord.Id;
                        fireEvent(
                            this.pageRef,
                            'purealoe__fieldselected',
                            selectedRecord.Id
                        );
                    }
                }
                this.template.mouseDown = false;
                this.template.dragging = false;
            });
            this.renderFields();
        }
        this._isRendered = true;
    }

    handleZoomChange(event) {
        this.template.scale = event.target.value;
        this.transform();
    }

    handleMouseDown() {
        this.template.mouseDown = true;
    }

    handleMouseMove(event) {
        if (this.template.mouseDown) {
            this.template.dragging = true;
            const svgWrapper = this.template.querySelector('.svg-wrapper');
            const style = window.getComputedStyle(svgWrapper);
            // eslint-disable-next-line no-undef
            const matrix = new WebKitCSSMatrix(style.webkitTransform);
            this.template.translateX = matrix.m41 + event.movementX;
            this.template.translateY = matrix.m42 + event.movementY;
            this.transform();
        }
    }

    handleIrrigationChanged(event) {
        const el = this.template.querySelector('.drop' + event.detail.mapId);
        if (el) {
            if (event.detail.status) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        }
    }

    handleRecordUpdated(record) {
        const dropEl = this.template.querySelector(
            '.drop' + getFieldValue(record, FIELD_MAP_ID)
        );
        if (dropEl) {
            dropEl.style.display = getFieldValue(record, FIELD_IRRIGATION)
                ? 'block'
                : 'none';
        }
    }

    handleHarvestFieldsChanged() {
        this.renderFields();
    }

    handleEmpMessage() {
        const harvestFields = this.harvestFields;
        for (let i = 0; i < harvestFields.length; i++) {
            if (harvestFields[i].Id === this.empMessage.Field_Id__c) {
                harvestFields[i].Status__c = this.empMessage.Status__c;
                this.renderFields();
                break;
            }
        }
    }

    transform() {
        const svgWrapper = this.template.querySelector('.svg-wrapper');
        svgWrapper.style.transform =
            'translate3d(' +
            this.template.translateX +
            'px,' +
            this.template.translateY +
            'px, 0) ' +
            'scale(' +
            this.template.scale +
            ',' +
            this.template.scale +
            ')';
    }

    renderFields() {
        const harvestFields = this.harvestFields;
        if (!harvestFields) {
            return;
        }
        let fieldEl;
        let dropEl;
        let labelEl;
        for (let i = 0; i < harvestFields.length; i++) {
            fieldEl = this.template.querySelector(
                '.field' + harvestFields[i].Map_Id__c
            );
            if (fieldEl) {
                let color = '#719344';
                if (harvestFields[i].Status__c === 'Alert') {
                    color = '#BD3833';
                } else if (harvestFields[i].Status__c === 'Warning') {
                    color = '#FFB75D';
                }
                fieldEl.style.fill = color;
            }
            dropEl = this.template.querySelector(
                '.drop' + harvestFields[i].Map_Id__c
            );
            if (dropEl) {
                dropEl.style.display = harvestFields[i].Irrigation__c
                    ? 'block'
                    : 'none';
            }
            labelEl = this.template.querySelector(
                '.label' + harvestFields[i].Map_Id__c
            );
            if (labelEl) {
                labelEl.childNodes[0].textContent = harvestFields[i].Name;
            }
        }
    }
}
