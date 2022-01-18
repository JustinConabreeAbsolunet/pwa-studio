import topologicalSort from '../../util/topologicalSort';
export default {};
const stepData = [];

const steps = topologicalSort(stepData);
const setStepCondition = (key, condition) => {
    const stepToChange = steps.find((step) => step.key === key);
    if (!stepToChange) {
        throw new Error(`Tried to change invalid checkout step condition: "${key}"`);
    }
    stepToChange.condition = condition;
}
/** Conditions **/
export {
    steps
};
