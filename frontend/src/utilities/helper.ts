export const classNames = (...classes: any[]): string => {
  return classes?.length ? classes.filter(Boolean).join(' ') : '';
};

//Type Guard Function
export const isString = (value: any): value is string => typeof value === 'string';
