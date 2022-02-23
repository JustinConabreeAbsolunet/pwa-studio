class CheckoutPageSteps {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._stepsToAdd = [];
        this._steps = venia.esModuleObject({
            module:
                '@magento/venia-ui/lib/components/CheckoutPage/steps.js',
            publish(targets) {
                targets.checkoutSteps.call(registry);
            }
        });
    }

    add({ key, importPath, stepTitle, before, after }) {
        this._steps.add(`import ${key} from '${importPath}'`);

        const itemData = {
            key,
            stepTitle
        };

        if (before) {
            itemData.before = before;
        }

        if (after) {
            itemData.after = after;
        }

        this._steps.insertAfterSource(
            'const stepData = [];',
            `stepData.push(${JSON.stringify(itemData)});`
        );
    }
}

module.exports = CheckoutPageSteps;
