import { useEffect, useCallback, useRef } from 'react';

const HAS_ONLY_VIRTUAL_PRODUCTS = false;

export default (props) => {
    const {
        setStepVisibility,
        handleNextStep,
        stepKey
    } = props;

    const shouldDisplayStep = useRef(true);
    const shippingInformationRef = useRef();

    useEffect(() => {
        shouldDisplayStep.current = !HAS_ONLY_VIRTUAL_PRODUCTS;
        setStepVisibility(stepKey, !HAS_ONLY_VIRTUAL_PRODUCTS);
    }, [setStepVisibility]);

    const handleDone = useCallback(() => {
        handleNextStep();
    }, [handleNextStep]);

    const handleSuccess = useCallback(() => {
        if (shippingInformationRef.current) {
            shippingInformationRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingInformationRef]);

    return {
        shippingInformationRef,
        handleDone,
        handleSuccess,
        shouldDisplay: shouldDisplayStep.current
    };
}
