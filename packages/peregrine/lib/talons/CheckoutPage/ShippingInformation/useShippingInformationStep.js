import { useEffect, useCallback, useRef } from 'react';

export default (props) => {
    const {
        setStepVisibility,
        handleNextStep,
        stepKey
    } = props;

    const shippingInformationRef = useRef();

    useEffect(() => {
        setStepVisibility(stepKey, true);
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
        handleSuccess
    };
}
