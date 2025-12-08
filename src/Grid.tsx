import { parse, format, addDays, isBefore } from "date-fns";
import Boxes from './Boxes.tsx';

// consider passing dateRange as a prop to grid

type GridProps = {
  dateRange: string[];
}

let startDate = '2025-01-01';
let endDate = new Date();


let currentDate = parse(startDate, 'yyyy-MM-dd', new Date());

let boundaryDate = addDays(endDate, 1);

let dateRange: Array<{ date: string, activity: boolean, level: number}> = [];

while(isBefore(currentDate, boundaryDate)) {
  const dateKey = format(currentDate, 'yyyy-MM-dd');
  dateRange.push({ date: dateKey, activity: false, level: 0});

  currentDate = addDays(currentDate, 1);
}

//Testing values directly
dateRange[0].activity = true;
dateRange[0].level = 0;
dateRange[1].activity = true;
dateRange[56].activity = true;
dateRange[56].level = 1;
dateRange[109].activity = true;
dateRange[109].level = 2;
dateRange[340].activity = true;


export default function Grid(){

  let elements = [];

  for (let i = 0; i < dateRange.length; i++) {
    const item = dateRange[i];

    const className =
      item.activity && item.level === 0 ? "box-item-lvl-0" :
      item.activity && item.level === 1 ? "box-item-lvl-1" :
      item.activity && item.level === 2 ? "box-item-lvl-2" :
      "box-item";

    elements.push(<div key={i} className={className}></div>);
  }

  return (
    <Boxes elements={elements}/>
  ) ;
}




