/* eslint-disable react/prop-types */

import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
const DateInput = ({ control, errors, label, name }) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Popover className='w-full'>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={`w-full justify-start text-left font-normal ${
                  !field.value && 'text-muted-foreground'
                }`}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />

      {errors[name] && (
        <p className='text-red-500 text-sm mt-1'>{errors[name].message}</p>
      )}
    </div>
  );
};

export default DateInput;
