import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DoughnutChartDemo from './ui/pieChart';
import StatsCard from './StatsCard';
import LineChart from './ui/lineGraph';

export const CenterBar: React.FC = () => {


  return (
    // <div className="grid grid-cols-[1fr_max-content]">
    //   <div className="bg-green-50 border border-green-400  mt-2 rounded-xl">
    //     <LineChart chartData={chartData}/>
    //   </div>
    //   <div className="grid h-fit p-2 gap-y-2">
    //     <div className="bg-white border-stone-200 h-full rounded-md border flex items-center ">
    //       <div className="w-32 m-2 h-32">
    //         <DoughnutChartDemo data={dataValues} labels={dataValues.map(item => item.label)} />
    //       </div>
    //       <div className="space-y-2">
    //         {dataValues.map((data, index) => (
    //           <div key={index} className="flex gap-x-2 items-center">
    //             <div className={`rounded-full w-4 h-4 ${'bg-['+data.color}]`}></div>
    //             <div className="text-xl font-semibold">{`${data.label}(${data.value}%)`}</div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //     <div className="grid-flow-col w-stretch h-48 item-stretch left-[182px] top-[60px]  justify-start items-center gap-2 inline-flex">
    //       <StatsCard value={58} label="Total Earning" color="green" icon={ChevronDown} />
    //       <StatsCard value={34} label="Total Earning" color="red" icon={ChevronUp} />
    //     </div>
    //   </div>
    // </div>
    <>
    </>
  );
};

export default CenterBar;
