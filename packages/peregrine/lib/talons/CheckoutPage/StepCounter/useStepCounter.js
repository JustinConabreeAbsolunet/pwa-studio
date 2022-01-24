import { useMemo } from 'react';

export default (props) => {
    const {
        loading,
        steps,
        stepKey
    } = props;

    const stepNumber = useMemo(() => {
        if (loading) {
            return null;
        }

        const stepIndex = steps
                .filter((visible) => visible)
                .findIndex(({ key }) => key === stepKey);

        return stepIndex !== -1 ?
            stepIndex + 1 :
            null;
    }, [loading, steps, stepKey]);

    return {
        loading,
        stepNumber
    };
}
