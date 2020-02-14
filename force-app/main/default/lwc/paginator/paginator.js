import { LightningElement, api } from 'lwc';

export default class Paginator extends LightningElement {
    @api label = 'items';
    @api page;
    @api pages;
    @api total;

    get hasMoreThanOnePage() {
        return this.page > 1;
    }

    get isEndOfPages() {
        return this.page < this.pages;
    }

    get pagesText() {
        return this.page + ' of ' + this.pages;
    }

    handlePagePrevious() {
        this.dispatchEvent(new CustomEvent('previouspage'));
    }

    handlePageNext() {
        this.dispatchEvent(new CustomEvent('nextpage'));
    }
}
