import { pyramidOfProgressData } from './getPyramidOfProgressData'

describe('getPyramidOfProgressData', () => {
  it('counts the number of writers who have acheived each milestone', () => {
    expect(pyramidOfProgressData([[0], [500], [550], [1200]], [500, 1000])).toEqual([
      {
        milestone: 500,
        writerCount: 3,
      },
      {
        milestone: 1000,
        writerCount: 1,
      },
    ])
  })
})
