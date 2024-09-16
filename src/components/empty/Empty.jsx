/* eslint-disable react/prop-types */

import { PlusCircle } from 'lucide-react';

const Empty = ({ onAddAction, text, subtext }) => {
  return (
    <div className='text-center py-10'>
      {onAddAction ? (
        <div className='mt-6'>
          <PlusCircle
            onClick={onAddAction}
            className='mx-auto h-12 w-12 text-gray-400 cursor-pointer'
          />
        </div>
      ) : null}
      <h3 className='mt-2 text-sm font-semibold text-gray-900'>{text}</h3>
      <p className='mt-1 text-sm text-gray-500'>{subtext}</p>
    </div>
  );
};

export default Empty;
