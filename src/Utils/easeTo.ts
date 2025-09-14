export const easeTo = (
    goal: number,
    value: number,
    speed: number,
    treshold: number,
) => {
    if (Math.abs(goal - value) <= treshold) {
        return goal;
    }

    return value + (goal - value) * speed;
};
