import * as React from "react";

interface Props {
  children?: React.ReactNode;
}

export const Typography = ({ children }: Props) => {
  return (
    <div>
      <h1>Typography</h1>
      {children}
    </div>
  );
};
