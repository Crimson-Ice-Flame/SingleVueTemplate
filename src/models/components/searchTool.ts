  export interface SearchToolProps {
    elementName:
      | 'nDatepicker'
      | 'nInput'
      | 'nInputNumber'
      | 'nSelect'
      | 'slot';
    changeEvent?: any;
    class?: string;
    defaultOrgSet?: boolean;
    disabled?: boolean;
    endTimestampField?: string;
    format?: string;
    function?: any;
    haveAll?: boolean;
    label?: string;
    max?: number;
    min?: number;
    multiple?: boolean;
    name: string;
    option_label?: any;
    option_value?: any;
    placeholder?: string;
    selectOptions?: any;
    startTimestampField?: string;
    elementType?: string;
    valueFormat?: string;
  }
