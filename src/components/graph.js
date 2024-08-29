import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartData = [
  { month: 0, vested: 0 },
  { month: 12, vested: 0 },
  { month: 24, vested: 100 },
  { month: 36, vested: 100 },
];

export function VestingPlanSummary() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Plan summary
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3673F5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3673F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280" }}
                tickFormatter={(value) => `${value}mo`}
              />
              <YAxis hide={true} domain={[0, 100]} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#3673F5", strokeWidth: 2 }}
              />
              <Area
                type="stepAfter"
                dataKey="vested"
                stroke="#3673F5"
                fillOpacity={1}
                fill="url(#colorVested)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-gray-600">Unlock frequency</div>
        <div className="font-semibold text-gray-800">Single</div>
      </CardFooter>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="text-sm text-gray-600">{`${label} months`}</p>
        <p className="text-sm font-bold text-gray-800">{`${payload[0].value}% vested`}</p>
      </div>
    );
  }
  return null;
};
