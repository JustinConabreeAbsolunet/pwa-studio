import { useState, useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

const REVIEW_STEP_KEY = 'REVIEW';

/**
 *
 * @param {Object[]} props.steps Sorted available steps
 * @param {string} props.steps[].key Step key
 * @param {Object} props.steps[].stepTitle Step translation data for continue button of preceding step
 * @param {string} props.steps[].stepTitle.id Key for translation
 * @param {string} props.steps[].stepTitle.defaultMessage Default messaging
 *
 * @returns {CheckoutStepContextTalonProps}
 */
export default (props) => {
    const {
        steps: allSteps
    } = props;

    /**
     * Change the current checkout step to a given key
     * @typedef CheckoutStepSetCurrentStepKey
     * @param {string} Identifier for step
     * @return void
     */
    const [currentStepKey, setCurrentStepKey] = useState();
    const [loading, setLoading] = useState(true);
    const { formatMessage } = useIntl();

    /**
     * Checkout step data
     * @typedef {Object} CheckoutStepStep
     * @property {string} key Identifier of step
     * @property {Object} stepTitle Step translation data for continue button of preceding step
     * @property {string} stepTitle.id Key for translation
     * @property {string} stepTitle.defaultMessage Default messaging
     * @property {boolean} finished Flag for visibility having been set
     * @property {boolean} visible Flag for visibility of step
     *
     * List of all available steps, regardless of visibility
     * @typedef {CheckoutStepStep[]} CheckoutStepSteps
     */
    const [steps, setStepData] = useState(() => {
        return allSteps.map(({ key, stepTitle }) => ({
            key,
            stepTitle,
            finished: false,
            visible: false
        }));
    });

    /**
     * Sets the visibility of a step
     * @typedef {function} CheckoutStepSetStepVisibility
     * @param {string} stepKey Identifier of step
     * @param {boolean} visible Flag for step visibility
     * @return void
     */
    const setStepVisibility = useCallback((stepKey, visible) => {
        setStepData((previousStepData) => {
            return previousStepData.map((previousStep) => {
                if (previousStep.key === stepKey) {
                    return {
                        ...previousStep,
                        visible,
                        finished: true
                    };
                }

                return previousStep;
            });
        });
    }, []);

    /**
     * Determine step position among other visible steps based on its identifier
     * @typedef {function} CheckoutStepGetStepIndex
     * @param {string} stepKey Identifier of step
     * @return {number}
     */
    const getStepIndex = useCallback((stepKey) => {
        if (stepKey === REVIEW_STEP_KEY) {
            return steps
                .filter(({ visible }) => visible)
                .length;
        }

        return steps
            .filter(({ visible }) => visible)
            .findIndex(({ key }) => key === stepKey);
    }, [steps]);

    /**
     * Determine step position among other visible steps for current checkout step.
     * Returns false when current step is not available
     * @typedef {function} CheckoutStepGetCurrentStepIndex
     * @return {number|false}
     */
    const getCurrentStepIndex = useCallback(() => {
        if (!currentStepKey) {
            return false;
        }

        const currentStepIndex = getStepIndex(currentStepKey);

        return currentStepIndex !== -1 ?
            currentStepIndex :
            false;
    }, [currentStepKey, getStepIndex]);

    /**
     * Go to the next visible step of the checkout
     * @typedef {function} CheckoutStepHandleNextStep
     * @param {string} requesterKey Identifier of step calling the function
     * @return {boolean}
     */
    const handleNextStep = useCallback((requesterKey) => {
        if (!requesterKey || requesterKey !== currentStepKey) {
            return false;
        }

        const currentIndex = getCurrentStepIndex();
        if (currentIndex === false) {
            return false;
        }

        const nextStep = steps
            .filter(({ visible }) => visible)
            .find((step, index) => index > currentIndex);

        if (nextStep) {
            setCurrentStepKey(nextStep.key);

            return true;
        }

        setCurrentStepKey(REVIEW_STEP_KEY);

        return true;
    }, [steps, getCurrentStepIndex, currentStepKey]);

    /**
     * Determine if a given step is currently or has been passed
     * @typedef {function} CheckoutStepIsStepVisited
     * @param {string} stepKey Identifier of step
     * @return {boolean}
     */
    const isStepVisited = useCallback((stepKey) => {
        const currentStep = getCurrentStepIndex();
        const requestedStep = getStepIndex(stepKey);

        if (currentStep === false || requestedStep === -1) {
            return false;
        }

        return requestedStep <= currentStep;
    }, [getStepIndex, getCurrentStepIndex]);

    /**
     * Determine if a given step has been passed
     * @typedef {function} CheckoutStepIsStepPassed
     * @param {string} stepKey Identifier of step
     * @return {boolean}
     */
    const isStepPassed = useCallback((stepKey) => {
        const currentStep = getCurrentStepIndex();
        const requestedStep = getStepIndex(stepKey);

        if (currentStep === false || requestedStep === -1) {
            return false;
        }

        return requestedStep < currentStep;
    }, [getStepIndex, getCurrentStepIndex]);

    const isOnLastStep = useMemo(() => {
        const stepIndex = getCurrentStepIndex();

        if (stepIndex === false) {
            return false;
        }

        return stepIndex === steps
            .filter(({ visible }) => visible)
            .length - 1;
    }, [getCurrentStepIndex, steps]);

    /**
     * Reset loading and visibility of all steps
     * @typedef {function} CheckoutStepResetAllSteps
     * @return void
     */
    const resetAllSteps = useCallback(() => {
        setCurrentStepKey(null);
        setLoading(true);
        setStepData((previousSteps) => {
            return previousSteps.map((previousStep) => ({
                ...previousStep,
                finished: false,
                visible: false
            }));
        });
    }, []);

    /**
     * Reset loading and visibility of given steps
     * @typedef {function} CheckoutStepResetStepLoading
     * @param {string[]} stepKeysToReset Keys to reset loading and visibility state
     * @return void
     */
    const resetStepLoading = useCallback((stepKeysToReset) => {
        if (!stepsToReset) {
            return;
        }

        setStepData((previousSteps) => {
            return previousStepData.forEach((previousStep) => ({
                ...previousStep,
                finished: stepKeysToReset.includes(previousStep.key) ?
                    false :
                    previousStep.finished,
                visible:  stepKeysToReset.includes(previousStep.key) ?
                    false :
                    previousStep.visible
            }));
        });
    }, []);

    /**
     * Gets the text to display in continue button. Returns null if next step is review
     * @typedef {function} CheckoutStepGetContinueText
     * @param {string} stepKey Key of step
     * @return {string|null}
     */
    const getContinueText = useCallback((stepKey) => {
        const nextStepIndex = getStepIndex(stepKey) + 1;
        const availableSteps = steps.filter(({ visible }) => visible);
        const reviewStepIndex = availableSteps.length;

        if (nextStepIndex === reviewStepIndex) {
            return null;
        }

        const stepTitleInfo = availableSteps[nextStepIndex].stepTitle

        return formatMessage(stepTitleInfo);
    }, [getStepIndex, steps, formatMessage]);

    /**
     * Go to the last visible step of the checkout
     * @typedef {function} CheckoutStepGoToLastStep
     * @return void
     */
    const goToLastStep = useCallback(() => {
        const availableSteps = steps.filter(({ visible }) => visible);
        setCurrentStepKey(
            availableSteps[availableSteps.length - 1].key
        );
    }, [setCurrentStepKey, steps]);


    useEffect(() => {
        const areAllFinished = steps.every(({ finished }) => finished);

        setLoading(!areAllFinished);
        if (areAllFinished && !currentStepKey) {
            const firstStep = steps.find(({ visible }) => visible);
            if (!firstStep) {
                setCurrentStepKey(REVIEW_STEP_KEY);
            } else {
                setCurrentStepKey(firstStep.key);
            }
        }
    }, [steps]);

    return {
        loading,
        currentStepKey,
        steps,
        getStepIndex,
        getCurrentStepIndex,
        setStepVisibility,
        setCurrentStepKey,
        goToLastStep,
        handleNextStep,
        resetAllSteps,
        resetStepLoading,
        isStepVisited,
        isStepPassed,
        isOnLastStep,
        getContinueText
    };
}

/**
 * Checkout Step Context data
 *
 * @typedef {Object} CheckoutStepContextTalonProps
 *
 * @property {boolean} loading Flag for all steps having set their visibility state
 * @property {string} currentStepKey Key of current checkout step
 * @property {CheckoutStepSteps} steps
 * @property {CheckoutStepGetStepIndex} getStepIndex
 * @property {CheckoutStepGetCurrentStepIndex} getCurrentStepIndex
 * @property {CheckoutStepSetStepVisibility} setStepVisibility
 * @property {CheckoutStepSetCurrentStepKey} setCurrentStepKey
 * @property {CheckoutStepGoToLastStep} goToLastStep
 * @property {CheckoutStepHandleNextStep} handleNextStep
 * @property {CheckoutStepResetAllSteps} resetAllSteps
 * @property {CheckoutStepResetStepLoading} resetStepLoading
 * @property {CheckoutStepIsStepVisited} isStepVisited
 * @property {CheckoutStepIsStepPassed} isStepPassed
 * @property {boolean} isOnLastStep Flag if checkout is on last step before review
 * @property {CheckoutStepGetContinueText} getContinueText
 */
