import { LightningElement, api, track, wire } from 'lwc';
import IMAGE_ALOE from '@salesforce/resourceUrl/purealoe';
import getMerchandise from '@salesforce/apex/MerchandiseController.getMerchandise';

export default class MerchandiseList extends LightningElement {
    @api pageSize;

    @track
    filterObjectStringified = JSON.stringify({
        searchKey: '',
        category: ''
    });

    @track page = 1;

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
