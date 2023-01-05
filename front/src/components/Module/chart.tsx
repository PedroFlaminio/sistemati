import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CustomTooltip = ({ active, payload }: { active: any; payload: any }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: "1rem" }}>
        <p className="label">{`Quantidade: ${payload[0].value}`}</p>
        <p className="label">{`Data: ${payload[0].payload.data}`}</p>
      </div>
    );
  }
  return null;
};

const Chart = ({ prop }: { prop: any }) => {
  return (
    <ResponsiveContainer width={window.innerWidth - 200} height={window.innerHeight - 500}>
      <BarChart
        data={prop}
        margin={{
          top: 5,
          right: 30,
          left: 30,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="data" interval={0} tick={{ fontSize: "0.6rem" }} />
        <YAxis />
        <Tooltip content={<CustomTooltip active={true} payload={prop} />} />
        <Legend iconType="circle" layout="vertical" />
        <Bar dataKey="quantidade" fill="#4e73df" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default Chart;
