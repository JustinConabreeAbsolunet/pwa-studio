import { useEffect, useCallback, useRef, useMemo } from 'react';

const VIRTUAL_TYPES = ['VirtualCartItem'];

export default (props) => {
    const {
        getContinueText,
        handleNextStep,
        stepKey,
        cartItems,
        loading
    } = props;

    const shippingMethodRef = useRef();
    const shouldDisplayStep = useRef(true);

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [getContinueText]);

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

    useEffect(() => {
        shouldDisplayStep.current = !cartItems.every((cartItem) => {
            return VIRTUAL_TYPES.includes(cartItem.__typename);
        });
    }, [cartItems]);

    return {
        shippingMethodRef,
        handleDone,
        handleSuccess,
        continueText,
        shouldDisplay: shouldDisplayStep.current
    };
}
