import { ReactNode } from "react";

export type ThemeColor = "primary"|"orange"|"danger"|"success"|"info";

export type CardProps = {
  color?: ThemeColor;
  title: string;
  value: string;
  icon: ReactNode;
}

const Card = (props: CardProps) => {
  const {color="primary",title,value,icon} = props
  return (              
  <div className="col card-flex">
  <div className={`card border-left-${color} shadow h-100 py-2`}>
    <div className="card-body">
      <div className="row no-gutters align-items-center">
        <div className="col mr-2">
          <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>
            <span className={`fw-bold text-${color}`} title="Total de pedidos">{title}</span>
          </div>
          <div className="h2 mb-0 font-weight-bold text-gray-800">{value}</div>
        </div>
        <div className="col-auto">
          {icon}
        </div>
      </div>
    </div>
  </div>
</div>)

}

export default Card;