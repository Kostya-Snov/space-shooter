export class AssertionError extends Error {
    public constructor(message?: string) {
        super(message);
    }
}

export const assert: (
    condition: boolean,
    message?: string
) => asserts condition = (condition, message) => {
    if (!condition) {
        throw new AssertionError(message);
    }
};
