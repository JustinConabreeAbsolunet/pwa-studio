import { useEffect, useCallback, useRef } from 'react';

const VIRTUAL_TYPES = ['VirtualCartItem'];

export default (props) => {
    const {
        handleNextStep,
        stepKey,
        cartItems
    } = props;

    const shippingMethodRef = useRef();
    const shouldDisplayStep = useRef(true);

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
        shouldDisplay: shouldDisplayStep.current
    };
}
