import { LightningElement, api, track } from 'lwc';

export default class Path extends LightningElement {
    @api
    set currentStep(value) {
        this._currentStep = value;
        this.calculateStepIndex();
    }
    get currentStep() {
        return this._currentStep;
    }
    @api
    set steps(value) {
        this._stepsRaw = value;
        this.stepsPrivate = value.map((val) => {
            return {
                value: val,
                cssClass: ''
            };
        });
        this.calculateStepIndex();
    }
    get steps() {
        return this.stepsPrivate;
    }
    @api stepChange;
    @track stepsPrivate;

    _currentStep = '';
    _stepsRaw;

    calculateStepIndex() {
        if (!this.stepsPrivate) {
            return;
        }

        if (this._stepsRaw && this._currentStep) {
            const stepIndex = this._stepsRaw.indexOf(this._currentStep);
            this.stepsPrivate.forEach((step, index) => {
                step.cssClass =
                    'slds-tabs_path__item ' +
                    (index < stepIndex
                        ? 'slds-is-complete'
                        : index === stepIndex
                        ? 'slds-is-current'
                        : 'slds-is-incomplete');
            });
        }
    }

    handleStepClicked(event) {
        this._currentStep = event.currentTarget.dataset.step;
        const eventStep = new CustomEvent('stepchange', {
            detail: { step: this._currentStep }
        });
        this.dispatchEvent(eventStep);
    }
}
