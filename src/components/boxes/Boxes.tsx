export default function Boxes(props: {elements: React.ReactNode[]}){
  const {elements} = props;

  return  <div className="boxes">
      {elements}
    </div>
}
