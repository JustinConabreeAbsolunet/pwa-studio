import { useEffect, useCallback, useRef, useMemo, useState } from 'react';

const VIRTUAL_TYPES = ['VirtualCartItem'];

export default (props) => {
    const {
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
    const shouldDisplayStep = useRef(true);
    const [shouldSubmitShippingMethod, setShouldSubmitShippingMethod] = useState(false);

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [getContinueText, loading]);

    const shouldDisplayContinueButton = useMemo(() => {
        console.log('continue text', continueText !== null);
        console.log('current step', currentStepKey === stepKey);

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
        shouldDisplayStep.current = !cartItems.every((cartItem) => {
            return VIRTUAL_TYPES.includes(cartItem.__typename);
        });
    }, [cartItems]);

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
