/* eslint-disable react/prop-types */
import { PlusCircle, PackageOpen } from 'lucide-react';

const Empty = ({ onAddAction, text, subtext }) => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center'>
      <div className='w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4'>
        <PackageOpen className='h-8 w-8 text-slate-300' />
      </div>
      <h3 className='text-base font-semibold text-slate-700 mb-1'>{text}</h3>
      <p className='text-sm text-slate-400 max-w-xs'>{subtext}</p>
      {onAddAction && (
        <button
          onClick={onAddAction}
          className='mt-5 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md'
        >
          <PlusCircle className='h-4 w-4' />
          Create New
        </button>
      )}
    </div>
  );
};

export default Empty;
