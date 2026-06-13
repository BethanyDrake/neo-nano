import { addMilliseconds, addSeconds, secondsToMilliseconds } from "date-fns"
import { getNewState } from "./stateMachine"
import { MyUpcomingSprint } from "@/lib/serverFunctions/sprints/publicSprint"

const buildMyUpcomingSprint = (overrides: Partial<MyUpcomingSprint>): MyUpcomingSprint => {

    return {
    id: '',
    startTime: new Date(),
    durationSeconds: 0,
    visibility: 'public',
    endTime: new Date(),
    hasStarted: false,
    ...overrides

}}
describe('state machine', () => {
    describe("when no sprint has started", () => {
        describe('and no sprint is upcoming', () => {
            it('does nothing', () => {
                 expect(getNewState('not-started', undefined)).toEqual({
                    newState: 'not-started',
                    delay: 0
                })
            })
        })
        describe("and a sprint is starting soon", () => {
            it("sets state to in progress once the sprint starts", () => {
                expect(getNewState('not-started', buildMyUpcomingSprint({startTime: addMilliseconds(new Date(), 1000)}),)).toEqual({
                    newState: 'in-progress',
                    delay: 1000
                })
            })
        })

         describe("and a sprint is already in progress", () => {
            it("sets state to in progress immediately", () => {
                expect(getNewState('not-started', buildMyUpcomingSprint({startTime: addMilliseconds(new Date(), -1000), durationSeconds: 30}),)).toEqual({
                    newState: 'in-progress',
                    delay: 0
                })
            })
        })

         describe("and the upcoming sprint has already finished", () => {
            it("sets state to finished immediately", () => {
                // and refreshes the next sprint? not sure
                expect(getNewState('not-started', buildMyUpcomingSprint({startTime: addSeconds(new Date(), -60), durationSeconds: 30}),)).toEqual({
                    newState: 'finished',
                    delay: 0
                })
            })
        })
    })

        describe("when the sprint is in-progress", () => {
        describe('and no sprint is upcoming', () => {
            it('revert to not-started state immediately', () => {
                 expect(getNewState('in-progress', undefined)).toEqual({
                    newState: 'not-started',
                    delay: 0
                })
            })
        })
        describe("and a sprint is starting soon", () => {
            it("changes to starting soon", () => {
                // invalid situation? 
                expect(getNewState('in-progress', buildMyUpcomingSprint({startTime: addMilliseconds(new Date(), 1000)}),)).toEqual({
                    newState: 'not-started',
                    delay: 0
                })
            })
        })

         describe("and a sprint is already in progress", () => {
            it("changes to finished state when the sprint ends", () => {
                expect(getNewState('in-progress', buildMyUpcomingSprint({startTime: addSeconds(new Date(), -1), durationSeconds: 30}),)).toEqual({
                    newState: 'finished',
                    delay: secondsToMilliseconds(29)
                })
            })
        })

         describe("and the upcoming sprint has already finished", () => {
            it("sets state to finished immediately", () => {
                // and refreshes the next sprint? not sure
                expect(getNewState('in-progress', buildMyUpcomingSprint({startTime: addSeconds(new Date(), -60), durationSeconds: 30}),)).toEqual({
                    newState: 'finished',
                    delay: 0
                })
            })
        })
    })

     describe("when the sprint has finished", () => {
        describe('and no sprint is upcoming', () => {
            it('does nothing', () => {
                 expect(getNewState('finished', undefined)).toEqual({
                    newState: 'finished',
                    delay: 0
                })
            })
        })
        describe("and a sprint is starting soon", () => {
            it("changes to the in-progress when the new sprint starts", () => {
                expect(getNewState('finished', buildMyUpcomingSprint({startTime: addMilliseconds(new Date(), 1000)}),)).toEqual({
                    newState: 'in-progress',
                    delay: 1000
                })
            })
        })

         describe("and a sprint is already in progress", () => {
            it("changes to finished state when the sprint ends", () => {
                expect(getNewState('finished', buildMyUpcomingSprint({startTime: addSeconds(new Date(), -1), durationSeconds: 30}),)).toEqual({
                    newState: 'finished',
                    delay: secondsToMilliseconds(29)
                })
            })
        })

         describe("and the upcoming sprint has already finished", () => {
            it("does nothing", () => {
                // and refreshes the next sprint? not sure
                expect(getNewState('finished', buildMyUpcomingSprint({startTime: addSeconds(new Date(), -60), durationSeconds: 30}),)).toEqual({
                    newState: 'finished',
                    delay: 0
                })
            })
        })
    })


     describe("when the sprint is in-review", () => {
        describe('and no sprint is upcoming', () => {
            it('does nothing', () => {
                 expect(getNewState('review', undefined)).toEqual({
                    newState: 'review',
                    delay: 0
                })
            })
        })
        describe("and a sprint is starting soon", () => {
            it("changes to the in-progress when the new sprint starts", () => {
                expect(getNewState('review', buildMyUpcomingSprint({startTime: addMilliseconds(new Date(), 1000)}),)).toEqual({
                    newState: 'in-progress',
                    delay: 1000
                })
            })
        })

         describe("and a sprint is already in progress", () => {
            it("changes to finished state when the sprint ends", () => {
                expect(getNewState('review', buildMyUpcomingSprint({startTime: addSeconds(new Date(), -1), durationSeconds: 30}),)).toEqual({
                    newState: 'finished',
                    delay: secondsToMilliseconds(29)
                })
            })
        })

         describe("and the upcoming sprint has already finished", () => {
            it("does nothing", () => {
                // and refreshes the next sprint? not sure
                expect(getNewState('review', buildMyUpcomingSprint({startTime: addSeconds(new Date(), -60), durationSeconds: 30}),)).toEqual({
                    newState: 'review',
                    delay: 0
                })
            })
        })
    })
})