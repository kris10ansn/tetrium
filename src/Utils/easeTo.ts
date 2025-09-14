export const easeTo = (
    goal: number,
    value: number,
    speed: number,
    treshold: number,
) => {
    const result = value + (goal - value) * speed;

    if (Math.abs(goal - result) <= treshold) {
        return goal;
    }

    return result;
};
