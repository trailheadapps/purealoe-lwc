import { LightningElement, api, wire } from 'lwc';
import IMAGE_ALOE from '@salesforce/resourceUrl/purealoe';
import getMerchandise from '@salesforce/apex/MerchandiseController.getMerchandise';

export default class MerchandiseList extends LightningElement {
    @api pageSize;

    filterObjectStringified = JSON.stringify({
        searchKey: '',
        category: ''
    });

    page = 1;

    @wire(getMerchandise, {
        filters: '$filterObjectStringified',
        pageSize: '$pageSize',
        pageNumber: '$page'
    })
    merchandises;

    get imageAloe() {
        return IMAGE_ALOE + '/aloe.png';
    }

    handlePagePrevious() {
        this.page -= 1;
    }

    handlePageNext() {
        this.page += 1;
    }
}
