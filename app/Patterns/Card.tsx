import React from "react";

interface CardInterface {
  children: any;
  header?: any;
  style?: any;
  [x: string]: any;
}

const Card = ({
  children,
  header = null,
  style = null,
  className,
  ...rest
}: CardInterface) => {
  return (
    <div
      className={`card mb-3 box-shadow-thin ${className}`}
      style={{ ...style }}
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-body xs-padding-thin">{children}</div>
    </div>
  );
};

export default Card;
