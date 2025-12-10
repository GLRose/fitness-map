import Boxes from '@/components/boxes/Boxes'
import { setDate } from "@/utils/dateRange.ts"

const dateRange: Array<{ date: string, activity: boolean, level: number}> = setDate();

export default function Grid(){

  const elements = [];

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




