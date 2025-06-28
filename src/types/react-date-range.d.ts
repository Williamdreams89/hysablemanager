declare module 'react-date-range' {
    import * as React from 'react';
  
    export interface Range {
      startDate: Date;
      endDate: Date;
      key?: string;
      color?: string;
    }
  
    export interface DateRangeProps {
      ranges: Range[];
      onChange: (ranges: { [key: string]: Range }) => void;
      showSelectionPreview?: boolean;
      moveRangeOnFirstSelection?: boolean;
      months?: number;
      direction?: 'vertical' | 'horizontal';
      preventSnapRefocus?: boolean;
      calendarFocus?: 'forwards' | 'backwards';
      editableDateInputs?: boolean;
      className?: string;
      maxDate?: Date;
      minDate?: Date;
    }
  
    export class DateRange extends React.Component<DateRangeProps> {}
  
    export {};
  }
  