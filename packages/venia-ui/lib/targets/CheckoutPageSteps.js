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

    add({ key, importPath, before, after }) {
        this._steps.add(`import ${key} from '${importPath}'`);

        let itemData = `{ key: '${key}'`;

        if (before) {
            itemData += `, before: '${before}'`;
        }

        if (after) {
            itemData += `, after: '${after}'`;
        }

        itemData += `}`;

        this._steps.insertAfterSource(
            'const stepData = [];',
            `stepData.push(${itemData});`
        );
    }
}

module.exports = CheckoutPageSteps;
