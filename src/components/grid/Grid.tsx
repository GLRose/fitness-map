import Boxes from '@/components/boxes/Boxes'
import { setDate } from "@/utils/dateRange.ts"
import { useState } from "react"

export default function Grid(){

  // const [dateRange, setDateRange] = useState<Array<{ date: string; activity: boolean; level: number }>>(() => setDate());
  const [dateRange, setDateRange] = useState<DateItem[]>(() => {
    const saved = localStorage.getItem("dateRange");
    return saved ? JSON.parse(saved) : setDate();
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const todayIndex = dateRange.length -1;
    //Study below
    if (todayIndex === -1) return;

    const newDateRange = [...dateRange];              
    newDateRange[todayIndex] = {                     
      ...newDateRange[todayIndex],
      activity: true
    };

    localStorage.setItem("dateStuff", JSON.stringify(newDateRange));

    //I hate this hack fix it pls
    const saved = localStorage.getItem("dateStuff");
    if (saved) {
      setDateRange(JSON.parse(saved));  
      if (dateRange.length === 0) return;

      const todayIndex = dateRange.length - 1;
      const updatedRange = [...dateRange];
      updatedRange[todayIndex] = { ...updatedRange[todayIndex], activity: true };

      setDateRange(updatedRange);
      localStorage.setItem("dateRange", JSON.stringify(updatedRange));
    }
  };

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
  <>
  <Boxes elements={elements}/>
    <form className="form" onSubmit={onSubmit}>
      <div className="form-inputs"> 
        <input className="form-input-fields" name="activity"/>
        <input className="form-input-fields"/>

        <button type="submit" className="submit-form">Log Activity</button>
      </div> 
    </form> 
  </>
  ) ;
}




