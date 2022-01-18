const getDependencyCount = (list, item, count = 0) => {
    const modifier = item.before || item.after;
    if (!modifier) {
        return count;
    }

    const nextItem = list.find(({ key }) => key === modifier);

    return getDependencyCount(list, nextItem, ++count);
}
export default (list) => {
    const sortedList = [...list]
        .filter((item) => !(item.before || item.after));

    list
        .filter((item) => (item.before || item.after))
        .sort((itemOne, itemTwo) => {
            if (itemOne.before === itemTwo.key || itemOne.after === itemTwo.key) {
                return 1;
            } else if (itemTwo.before === itemOne.key || itemTwo.after === itemOne.key) {
                return -1;
            }

            const itemOneDependencyCount = getDependencyCount(list, itemOne);
            const itemTwoDependencyCount = getDependencyCount(list, itemTwo);

            return itemOneDependencyCount - itemTwoDependencyCount;
        })
        .forEach((item) => {
            const dependencyKey = item.before || item.after;
            const indexModifier = item.after ? 1 : 0;
            const dependencyIndex = sortedList
                .findIndex((sortedItem) => sortedItem.key === dependencyKey);
            sortedList.splice(dependencyIndex + indexModifier, 0, item);
        });

    return sortedList
};
