import { useState, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';

const REVIEW_STEP_KEY = 'REVIEW';

export default (props) => {
    const {
        steps: allSteps
    } = props;

    const [currentStepKey, setCurrentStepKey] = useState();
    const [loading, setLoading] = useState(true);
    const { formatMessage } = useIntl();

    const [steps, setStepData] = useState(() => {
        return allSteps.map(({ key, stepTitle }) => ({
            key,
            stepTitle,
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
        if (stepKey === REVIEW_STEP_KEY) {
            return steps
                .filter(({ visible }) => visible)
                .length;
        }

        return steps
            .filter(({ visible }) => visible)
            .findIndex(({ key }) => key === stepKey);
    }, [steps]);

    const getCurrentStepIndex = useCallback(() => {
        if (!currentStepKey) {
            return false;
        }

        const currentStepIndex = getStepIndex(currentStepKey);

        return currentStepIndex !== -1 ?
            currentStepIndex :
            false;
    }, [currentStepKey, getStepIndex]);

    const handleNextStep = useCallback((requesterKey) => {
        if (requesterKey !== currentStepKey) {
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

    const isStepVisited = useCallback((stepKey) => {
        const currentStep = getCurrentStepIndex();
        const requestedStep = getStepIndex(stepKey);

        if (currentStep === false || requestedStep === -1) {
            return false;
        }

        return requestedStep <= currentStep;
    }, [getStepIndex, getCurrentStepIndex]);

    const isStepPassed = useCallback((stepKey) => {
        const currentStep = getCurrentStepIndex();
        const requestedStep = getStepIndex(stepKey);

        if (currentStep === false || requestedStep === -1) {
            return false;
        }

        return requestedStep < currentStep;
    }, [getStepIndex, getCurrentStepIndex]);

    const resetStepLoading = useCallback(() => {
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

    const getContinueText = useCallback((stepKey) => {
        const nextStepIndex = getStepIndex(stepKey) + 1;
        const availableSteps = steps.filter(({ visible }) => visible);
        const reviewStepIndex = availableSteps.length;

        if (nextStepIndex === reviewStepIndex) {
            return formatMessage({
                id: 'checkoutPage.reviewCta',
                defaultMessage: 'Review Order'
            });
        }

        const stepTitleInfo = availableSteps[nextStepIndex].stepTitle

        return formatMessage(stepTitleInfo);
    }, [getStepIndex, steps, formatMessage]);


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
        handleNextStep,
        resetStepLoading,
        isStepVisited,
        isStepPassed,
        getContinueText
    };
}
