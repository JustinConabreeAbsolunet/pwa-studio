import { useState, useCallback, useEffect } from 'react';

export default (props) => {
    const { steps: allSteps } = props;

    const [currentStepKey, setCurrentStepKey] = useState();
    const [loading, setLoading] = useState(true);

    const [steps, setStepData] = useState(() => {
        return allSteps.map(({ key }) => ({
            key,
            finished: false,
            visible: false
        }));
    });

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

    const getStepIndex = useCallback((stepKey) => {
        return steps
            .filter(({ visible }) => visible)
            .findIndex(({ key }) => key === stepKey);
    });

    const getCurrentStepIndex = useCallback(() => {
        if (!currentStepKey) {
            return false;
        }

        return getStepIndex(currentStepKey);
    }, [currentStepKey, getStepIndex]);

    const handleNextStep = useCallback(() => {
        const currentIndex = getCurrentStepIndex();
        if (!currentIndex) {
            return false;
        }

        const nextStep = steps
            .filter(({ visible }) => visible)
            .find((step, index) => index > currentIndex);

        if (nextStep) {
            setCurrentStepKey(nextStep.key);

            return true;
        }

        return false;
    }, [steps, getCurrentStepIndex]);


    useEffect(() => {
        const areAllFinished = steps.every(({ finished }) => finished);

        setLoading(!areAllFinished);
        if (areAllFinished) {
            const firstStep = steps.find(({ visible }) => visible);
            setCurrentStepKey(firstStep.key);
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
        handleNextStep
    };
}
