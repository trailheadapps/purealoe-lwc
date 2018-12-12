import { LightningElement } from 'lwc';

import RESOURCE_PUREALOE from '@salesforce/resourceUrl/purealoe';

export default class ActionBar extends LightningElement {
    get iconIrrigation() {
        return RESOURCE_PUREALOE + '/icon_irrigation.svg';
    }

    get iconSeed() {
        return RESOURCE_PUREALOE + '/icon_seed.svg';
    }

    get iconLevel() {
        return RESOURCE_PUREALOE + '/icon_level.svg';
    }

    get iconLabor() {
        return RESOURCE_PUREALOE + '/icon_labor.svg';
    }

    get iconBug() {
        return RESOURCE_PUREALOE + '/icon_bug.svg';
    }

    handleClick() {
        this.dispatchEvent(new CustomEvent('action'));
    }
}
