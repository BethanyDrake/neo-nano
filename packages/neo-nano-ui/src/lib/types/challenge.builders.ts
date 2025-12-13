import { Challenge } from "../challenges";

export const buildChallenge = (overrides: Partial<Challenge> = {}): Challenge => {
    return {
    id: "",
    title: "",
    startDate: "",
    lengthDays: 0,
    target: 0,
    metric: "words",
    ...overrides
}
}