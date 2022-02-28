import { useEffect, useCallback, useRef, useMemo, useState } from 'react';

const VIRTUAL_TYPES = ['VirtualCartItem'];

/**
 * @param {CheckoutStepSteps} props.steps
 * @param {CheckoutStepGetContinueText} props.getContinueText
 * @param {CheckoutStepHandleNextStep} props.handleNextStep
 * @param {string} props.stepKey Identifier of this step
 * @param {Array} props.cartItems Cart items from checkout page
 * @param {Boolean} props.loading Loading state of all checkout steps
 * @param {string} props.currentStepKey Current checkout step identifier
 * @param {boolean} props.isOnLastStep Flag if checkout is on last step before review
 * @param {boolean} props.reviewOrderButtonClicked Flag if review button was clicked
 * @param {function} props.resetReviewOrderButtonClicked Reset the flag of the review button being clicked
 *
 * @returns {ShippingMethodStepTalonProps}
 */
export default (props) => {
    const {
        steps,
        getContinueText,
        handleNextStep,
        stepKey,
        cartItems,
        loading,
        isOnLastStep,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked,
        currentStepKey
    } = props;

    const shippingMethodRef = useRef();
    const shouldDisplayStep = useRef(null);
    const [shouldSubmitShippingMethod, setShouldSubmitShippingMethod] = useState(false);

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [getContinueText, loading]);

    const shouldDisplayContinueButton = useMemo(() => {
        return continueText !== null && currentStepKey === stepKey;
    }, [continueText, currentStepKey]);

    const handleDone = useCallback(() => {
        handleNextStep(stepKey);
    }, [handleNextStep]);

    const handleSuccess = useCallback(() => {
        if (shippingMethodRef.current) {
            shippingMethodRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingMethodRef]);

    const resetShouldSubmitShippingMethod = useCallback(() => {
        setShouldSubmitShippingMethod(false);

        if (currentStepKey !== stepKey) {
            return;
        }

        if (isOnLastStep) {
            resetReviewOrderButtonClicked();

            return;
        }
    }, [currentStepKey, resetReviewOrderButtonClicked]);

    useEffect(() => {
        const onlyVirtualProducts = cartItems.every((cartItem) => {
            return VIRTUAL_TYPES.includes(cartItem.__typename);
        });

        const step = steps.find(({ key }) => key === stepKey);

        const isHidden = step.finished && !step.visible;

        shouldDisplayStep.current = !onlyVirtualProducts && !isHidden;
    }, [cartItems, steps]);

    useEffect(() => {
        if (currentStepKey !== stepKey) {
            return;
        }

        setShouldSubmitShippingMethod(reviewOrderButtonClicked);
    }, [reviewOrderButtonClicked]);

    return {
        shippingMethodRef,
        handleDone,
        handleSuccess,
        continueText,
        shouldSubmitShippingMethod,
        resetShouldSubmitShippingMethod,
        shouldDisplayContinueButton,
        shouldDisplay: shouldDisplayStep.current
    };
}

/**
 * @typedef {Object} ShippingMethodStepTalonProps
 *
 * @property {Object} shippingMethodRef Reference for shipping method scroll anchor
 * @property {function} handleDone After save handler to go to next step
 * @property {function} handleSuccess After success handler to scroll element into focus
 * @property {string|null} continueText Text of the button to go to next step
 * @property {boolean} shouldDisplayContinueButton Flag to display or hide the continue step depending on step position
 * @property {boolean} shouldDisplay Flag for the step visibility to render or hide the sub-components
 * @property {boolean} shouldSubmitShippingMethod State flag to trigger submitting from outside of the shipping information step
 * @property {function} resetShouldSubmitShippingMethod Callback to reset the should submit flag
 */
