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

    add({ key, importPath, condition, before, after }) {
        this._steps.add(`import ${key} from '${importPath}'`);

        let itemData = `{ key: '${key}'`;

        if (condition) {
            itemData += `, condition: ${condition.toString()}`;
        }

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

    setCondition(key, condition) {
        this._steps.insertAfterSource(
            `/** Conditions **/`,
            `setStepCondition('${key}', ${condition.toString()});`
        );
    }
}

module.exports = CheckoutPageSteps;
