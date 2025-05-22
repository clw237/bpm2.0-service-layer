import { IButtonProps } from 'model/interfaces';
import { FC } from 'react';
import './index.css';

export const Button: FC<IButtonProps> = (props: IButtonProps) => {
  const { classes, onBtnClick, label } = props;

  return (
    <div>
      <button className={`btn-responsive btn-outline btn-success ${classes}`} onClick={onBtnClick}>
        {label}
      </button>
    </div>
  );
};
