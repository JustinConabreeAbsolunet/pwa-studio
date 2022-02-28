import { useEffect, useCallback, useMemo, useState, useRef } from 'react';

/**
 * @param {CheckoutStepSteps} props.steps
 * @param {CheckoutStepGetContinueText} props.getContinueText
 * @param {CheckoutStepHandleNextStep} props.handleNextStep
 * @param {string} props.stepKey Identifier of this step
 * @param {CheckoutStepSetCurrentStepKey} props.setCurrentStepKey
 * @param {Boolean} props.loading Loading state of all checkout steps
 * @param {string} props.currentStepKey Current checkout step identifier
 * @param {boolean} props.isOnLastStep Flag if checkout is on last step before review
 * @param {boolean} props.reviewOrderButtonClicked Flag if review button was clicked
 * @param {function} props.resetReviewOrderButtonClicked Reset the flag of the review button being clicked
 *
 * @returns {PaymentInformationStepTalonProps}
 */
export default (props) => {
    const {
        steps,
        getContinueText,
        handleNextStep,
        stepKey,
        setCurrentStepKey,
        loading,
        currentStepKey,
        isOnLastStep,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked
    } = props;

    const shouldDisplayStep = useRef(null);
    const [shouldSubmitPayment, setShouldSubmitPayment] = useState(false);

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [loading, getContinueText]);

    const shouldDisplayContinueButton = useMemo(() => {
        return continueText !== null && currentStepKey === stepKey;
    }, [continueText, currentStepKey])

    const handleContinueClick = useCallback(() => {
        setShouldSubmitPayment(true);
    }, []);

    const handleDone = useCallback(() => {
        globalThis.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
        handleNextStep(stepKey);
    }, [handleNextStep]);

    const resetShouldSubmitPayment = useCallback(() => {
        setShouldSubmitPayment(false);

        if (currentStepKey !== stepKey) {
            return;
        }

        if (isOnLastStep) {
            resetReviewOrderButtonClicked();

            return;
        }
    }, [currentStepKey, resetReviewOrderButtonClicked]);

    const resetPaymentStep = useCallback(() => {
        setCurrentStepKey('PAYMENT');
    }, [setCurrentStepKey]);

    useEffect(() => {
        const step = steps.find(({ key }) => key === stepKey);

        const isHidden = step.finished && !step.visible;

        shouldDisplayStep.current = !isHidden;
    }, [steps]);

    useEffect(() => {
        if (currentStepKey !== stepKey) {
            return;
        }

        setShouldSubmitPayment(reviewOrderButtonClicked);
    }, [reviewOrderButtonClicked]);

    return {
        handleDone,
        resetPaymentStep,
        continueText,
        shouldSubmitPayment,
        resetShouldSubmitPayment,
        handleContinueClick,
        shouldDisplayContinueButton,
        shouldDisplay: shouldDisplayStep.current
    };
}

/**
 * @typedef {Object} PaymentInformationStepTalonProps
 *
 * @property {function} handleDone After save handler to go to next step
 * @property {string|null} continueText Text of the button to go to next step
 * @property {boolean} shouldDisplayContinueButton Flag to display or hide the continue step depending on step position
 * @property {boolean} shouldDisplay Flag for the step visibility to render or hide the sub-components
 * @property {boolean} shouldSubmitPayment State flag to trigger submitting the payment from outside of the payment
 * @property {function} resetShouldSubmitPayment Callback to reset the should submit flag
 * @property {function} handleContinueClick Callback for the continue button to go to the next step
 * @property {function} resetPaymentStep Callback to go to the payment step
 */
