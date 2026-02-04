// @ts-expect-error test
const MockCalendar = ({tileContent} )=> {
return <div>
   Mock Calendar
   {tileContent({date: new Date(), view: 'month'})}
</div> 
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TileContentFunc = {}
export default MockCalendar