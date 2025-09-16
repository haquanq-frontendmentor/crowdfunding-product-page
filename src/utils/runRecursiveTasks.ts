export const runRecursiveTasks = (tasks: Array<() => void>): void => {
    const run = (index: number) => {
        if (index >= tasks.length) return;
        tasks[index]();
        run(index + 1);
    };
    run(0);
};
