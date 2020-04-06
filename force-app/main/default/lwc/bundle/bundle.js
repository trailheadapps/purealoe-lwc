import { LightningElement, api, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import {
    createRecord,
    updateRecord,
    deleteRecord
} from 'lightning/uiRecordApi';
import BUNDLE_ITEM_OBJECT from '@salesforce/schema/Bundle_Item__c';
import COUNT_UP from '@salesforce/resourceUrl/countup';
import getBundleItems from '@salesforce/apex/BundleController.getBundleItems';

export default class Bundle extends LightningElement {
    @api recordId;
    bundleItems = [];
    error;
    totalQty = 0;
    totalMSRP = 0;
    _bundleItem;
    _isRendered;

    @wire(getBundleItems, { bundleId: '$recordId' })
    apexBundleItems({ error, data }) {
        if (error) {
            this.error = error;
            this.bundleItems = undefined;
        } else if (data) {
            this.error = undefined;
            this.bundleItems = data.map((item) => {
                return {
                    id: item.Id,
                    merchandiseId: item.Merchandise__r.Id,
                    name: item.Merchandise__r.Name,
                    title: item.Merchandise__r.Title__c,
                    price: item.Merchandise__r.Price__c,
                    category: item.Merchandise__r.Category__c,
                    pictureURL: item.Merchandise__r.Picture_URL__c,
                    qty: item.Qty__c
                };
            });
            this.calculateBundle();
        }
    }

    renderedCallback() {
        if (this._isRendered) return;
        this._isRendered = true;
        loadScript(this, COUNT_UP)
            .then(() => {
                this.calculateBundle();
            })
            .catch((error) => {
                this.error = error;
            });
    }

    calculateBundle() {
        const bundleItems = this.bundleItems;
        const oldTotalMSRP = this.totalMSRP;
        let totalQty = 0;
        let totalMSRP = 0;
        if (bundleItems && Array.isArray(bundleItems)) {
            bundleItems.forEach((bundleItem) => {
                totalQty += bundleItem.qty;
                totalMSRP += bundleItem.qty * bundleItem.price;
            });
            this.totalQty = totalQty;
            this.totalMSRP = totalMSRP;
            const el = this.template.querySelector('.totalMSRP');
            // eslint-disable-next-line no-undef
            const numAnim = new CountUp(el, oldTotalMSRP, totalMSRP, 0, 0.5);
            numAnim.start();
        }
    }

    handleDrop(event) {
        event.preventDefault();
        this.template.querySelector('.drop-zone').classList.remove('active');
        const merchandise = JSON.parse(
            event.dataTransfer.getData('merchandise')
        );
        const bundleItem = {
            bundleId: this.recordId,
            merchandiseId: merchandise.Id,
            qty: 10,
            name: merchandise.Name,
            title: merchandise.Title__c,
            price: merchandise.Price__c,
            category: merchandise.Category__c,
            pictureURL: merchandise.Picture_URL__c
        };
        this.addItem(bundleItem);
    }

    handleDragOver(event) {
        event.preventDefault();
        this.template.querySelector('.drop-zone').classList.add('active');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.template.querySelector('.drop-zone').classList.remove('active');
    }

    handleBundleItemDelete(event) {
        this._bundleItem = event.detail;
        this.removeItem();
    }

    handleBundleItemChange(event) {
        event.preventDefault();
        if (event.detail.qty) {
            this._bundleItem = event.detail;
            this.updateItem();
        }
    }

    addItem(bundleItem) {
        const recordInput = {
            apiName: BUNDLE_ITEM_OBJECT.objectApiName,
            fields: {
                Bundle__c: bundleItem.bundleId,
                Merchandise__c: bundleItem.merchandiseId,
                Qty__c: bundleItem.qty
            }
        };
        createRecord(recordInput)
            .then((result) => {
                bundleItem.id = result.id;
                this.bundleItems.push(bundleItem);
                this.calculateBundle();
            })
            .catch((error) => {
                this.error = error;
            });
    }

    removeItem() {
        deleteRecord(this._bundleItem.id)
            .then(() => {
                const currentBundleItems = this.bundleItems;
                this.bundleItems.forEach((bundleItem, index) => {
                    if (this._bundleItem.id === bundleItem.id) {
                        currentBundleItems.splice(index, 1);
                    }
                });
                this.bundleItems = currentBundleItems;
                this.calculateBundle();
            })
            .catch((error) => {
                this.error = error;
            });
    }

    updateItem() {
        let record = {
            fields: {
                Id: this._bundleItem.id,
                Qty__c: this._bundleItem.qty
            }
        };
        updateRecord(record)
            .then(() => {
                this.bundleItems.forEach((bundleItem, index) => {
                    if (this._bundleItem.id === bundleItem.id) {
                        this.bundleItems[index] = this._bundleItem;
                    }
                });
                this.calculateBundle();
            })
            .catch((error) => {
                this.error = error;
            });
    }
}
