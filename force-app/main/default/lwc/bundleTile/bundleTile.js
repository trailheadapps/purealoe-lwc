import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BundleTile extends NavigationMixin(LightningElement) {
    @api
    set bundleItem(value) {
        this._bundleItem = Object.assign({}, value);
    }
    get bundleItem() {
        return this._bundleItem;
    }
    _bundleItem;

    handleTitleClick(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: this.bundleItem.merchandiseId
            }
        });
    }

    handleDelete() {
        const deleteEvent = new CustomEvent('delete', {
            detail: { id: this._bundleItem.id }
        });
        this.dispatchEvent(deleteEvent);
    }

    handleQtyChange(event) {
        const qty = event.target.value;
        if (qty !== this._bundleItem.qty) {
            this._bundleItem.qty = parseInt(qty, 10);
            const changeEvent = new CustomEvent('change', {
                detail: {
                    id: this._bundleItem.id,
                    qty: this._bundleItem.qty,
                    price: this._bundleItem.price
                }
            });
            this.dispatchEvent(changeEvent);
        }
    }
}
