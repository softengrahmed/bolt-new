export function assertEqual(actual, expected) {
    if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
    }
}