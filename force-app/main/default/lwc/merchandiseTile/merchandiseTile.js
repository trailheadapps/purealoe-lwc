import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class MerchandiseTile extends NavigationMixin(LightningElement) {
    @api merchandise;

    handleTitleClicked(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: this.merchandise.Id
            }
        });
    }

    handleDragStarted(event) {
        event.dataTransfer.setData(
            'merchandise',
            JSON.stringify(this.merchandise)
        );
    }
}
