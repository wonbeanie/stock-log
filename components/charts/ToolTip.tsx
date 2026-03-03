export default function ToolTip({data} : Props) {
  const profitText = data.profit.toLocaleString();
  const color = data.value >= 0 ? '#ef4444' : '#3b82f6';

  return (
    <>
      <div className="mb-1 font-bold">{data.name}</div>
      <div className="flex justify-between gap-[10px]">
        <span>수익률:</span>
        <span className="font-bold" style={{color}}>{data.value}%</span>
      </div>
      <div className="flex justify-between gap-[10px]">
        <span>수익금:</span>
        <span className="font-bold">{profitText}원</span>
      </div>
    </>
  )
}

interface Props {
  data : {
    name : string,
    value : number,
    profit : number
  }
}