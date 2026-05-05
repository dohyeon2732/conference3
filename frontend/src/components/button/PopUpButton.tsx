import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'thickGray' | 'gray' | 'red';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'blue',
  children,
  ...props
}) => {
  const base =
    'w-full rounded-[8px] cursor-pointer transition-[background] duration-300 box-border border-0 disabled:cursor-not-allowed';

  const sizeClass = 'max-w-[112px] h-[34px] text-[16px] font-[700]';

  const variantClass = {
    blue: 'bg-[#86A6FF] text-[#fff] font-[Pretendard] font-bold leading-[140%]',
    thickGray: 'bg-[#bebebe] text-[#fff]',
    gray: 'bg-[#bebebe] text-[#fff] ',
    red: 'bg-[#FFA193] text-[#fff] border-[1px] border-solid',
  }[variant];

  return (
    <button
      className={classNames(base, sizeClass, variantClass)}
      disabled={variant === 'thickGray'}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
