import { LightningElement, api } from 'lwc';

export default class IrrigationDialog extends LightningElement {
    @api harvestFields;
    @api selectedHarvestFields;
    options;
    value;

    connectedCallback() {
        const fields = this.harvestFields;
        const selectedFields = this.selectedHarvestFields;

        const options = [];
        fields.forEach((field) => {
            options.push({
                value: field.Id,
                label: field.Name
            });
        });

        const value = [];
        selectedFields.forEach((field) => {
            value.push(field.Id);
        });
        this.options = options;
        this.value = value;
    }

    handleDialogClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleDialogSubmit() {
        const selectedIds = this.value;
        const fields = [];

        this.harvestFields.forEach((harvestField) => {
            if (selectedIds.indexOf(harvestField.Id) > -1) {
                fields.push({
                    id: harvestField.Id,
                    irrigation: true
                });
            } else {
                fields.push({
                    id: harvestField.Id,
                    irrigation: false
                });
            }
        });

        const event = new CustomEvent('submit', {
            detail: fields
        });
        this.dispatchEvent(event);
    }

    handleListChange(event) {
        this.value = event.target.value;
    }
}
