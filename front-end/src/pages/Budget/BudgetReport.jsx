import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { AlertCircle, ArrowRightIcon, Calendar, DollarSign, Percent } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/api/interceptor";
import { Button } from "@/components/ui/button";

const BudgetReport = ({ id }) => {
  const [budgetData, setBudgetData] = useState(null);
  const [percentage, setPercentage] = useState(true);
  const GOLD_COLOR = "hsl(51, 90%, 44%)";
  const GOLD_VARIANTS = [
    GOLD_COLOR,
    "hsl(51, 85%, 40%)",
    "hsl(51, 80%, 35%)",
    "hsl(51, 75%, 30%)",
    "hsl(51, 70%, 25%)",
  ];
  const glassStyle =
    "bg-gold/20 backdrop-blur-lg border border-white/30 shadow-lg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/itineraries/${id}/report/`);
        if (res.data && res.data.breakdown) {
          const parsedData = {
            ...res.data,
            breakdown:
              typeof res.data.breakdown === "string"
                ? JSON.parse(res.data.breakdown)
                : res.data.breakdown,
          };
          console.log(parsedData.breakdown);
          setBudgetData(parsedData);
        }
        
      } catch (error) {
        console.error("Error fetching budget report:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleClick = () => setPercentage((prev) => !prev);

  const handleDownload = () => {
    window.print();
  };

  if (!budgetData || !budgetData.breakdown) {
    return <div className="p-6 text-white text-center">Loading...</div>;
  }

  const breakdown = budgetData.breakdown;

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    lastDate.setDate(lastDate.getDate() + 1);

    while (currentDate < lastDate) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const allDates = getDatesInRange(breakdown.start_date, breakdown.end_date);
  const daysPlanned = allDates.length;
  const categoryData = Object.entries(breakdown.category_breakdown).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const dailySpendingData = allDates
    .map((date) => {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const percentage = breakdown.daily_budget_utilization[date]
        ? parseFloat(breakdown.daily_budget_utilization[date].replace("%", ""))
        : 0;

      const amount = breakdown.day_wise_breakdown[date] || 0;

      return {
        date: formattedDate,
        fullDate: date,
        percentage,
        amount,
      };
    })
    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

  const prepareCategoryTrendData = (trendData) => {
    const categoryTemplate = {};
    Object.keys(trendData).forEach((category) => {
      categoryTemplate[category] = 0;
    });

    return allDates
      .map((date) => {
        const dataPoint = {
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          fullDate: date,
          ...categoryTemplate,
        };

        Object.entries(trendData).forEach(([category, values]) => {
          if (values[date] !== undefined) {
            dataPoint[category] = values[date];
          }
        });

        return dataPoint;
      })
      .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
  };

  const categoryTrendData = prepareCategoryTrendData(
    breakdown.category_trend_over_time
  );

  const stats = [
    {
      title: "Total Budget",
      value: `${breakdown.budget.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-gold" />,
    },
    {
      title: "Total Spent",
      value: `${breakdown.total_expenditure.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-gold" />,
    },
    {
      title: "Budget Utilization",
      value: breakdown.budget_utilization,
      icon: <Percent className="h-6 w-6 text-gold" />,
    },
    {
      title: "Days Planned",
      value: daysPlanned,
      icon: <Calendar className="h-6 w-6 text-gold" />,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-black text-white">
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold text-center">Trip Budget Report</h1>
          <p className="text-white/80">
            Destination: {breakdown.destination_location} | Generated:{" "}
            {new Date(budgetData.generated_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`${glassStyle}`}>
            <CardContent className="flex flex-row items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-white/80">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              {stat.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={glassStyle}>
          <CardHeader>
            <CardTitle className="text-white">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: $${value}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GOLD_VARIANTS[index % GOLD_VARIANTS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: `1px solid ${GOLD_COLOR}`,
                      backdropFilter: "blur(8px)",
                      color: "white",
                    }}
                    itemStyle={{ color: "white" }} 
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-white">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={glassStyle}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">
              Daily Budget Utilization
            </CardTitle>
            <div onClick={handleClick}>
              {percentage ? (
                <Percent className="text-white cursor-pointer" />
              ) : (
                <DollarSign className="text-white cursor-pointer" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySpendingData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="gold"
                    opacity={0.2}
                  />
                  <XAxis dataKey="date" stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: `1px solid gold`,
                      backdropFilter: "blur(8px)",
                      color: "white",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-white">{value}</span>
                    )}
                  />
                  {percentage ? (
                    <Bar dataKey="amount" name="Amount ($)" fill={GOLD_COLOR} />
                  ) : (
                    <Bar dataKey="percentage" name="Percentage (%)" fill={GOLD_COLOR} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`${glassStyle} lg:col-span-2`}>
          <CardHeader>
            <CardTitle className="text-white">
              Category Spending Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={categoryTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GOLD_COLOR}
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="white"
                    tick={{ fill: "white" }}
                  />
                  <YAxis stroke="white" tick={{ fill: "white" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: `1px solid ${GOLD_COLOR}`,
                      backdropFilter: "blur(8px)",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-white">{value}</span>
                    )}
                  />
                  {Object.keys(breakdown.category_trend_over_time).map(
                    (category, index) => (
                      <Line
                        key={category}
                        type="monotone"
                        dataKey={category}
                        stroke={GOLD_VARIANTS[index % GOLD_VARIANTS.length]}
                        strokeWidth={2}
                        dot={{
                          fill: GOLD_VARIANTS[index % GOLD_VARIANTS.length],
                          r: 4,
                        }}
                        activeDot={{ r: 6, stroke: "white" }}
                      />
                    )
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className={glassStyle}>
            <CardHeader>
              <CardTitle className="text-white">Most Expensive Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(breakdown.top_expensive_days ?? {}).map(
                  ([date, amount], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white/80">{date}</span>
                      </div>
                      <span className="text-xl font-bold text-gold flex items-center">
                        <DollarSign className="h-5 w-5" />
                        {amount}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
          <Card className={glassStyle}>
            <CardHeader>
              <CardTitle className="text-white">Most Expensive Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(breakdown.top_expensive_days ?? {}).map(
                  ([date, amount], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white/80">{date}</span>
                      </div>
                      <span className="text-xl font-bold text-gold flex items-center">
                        <DollarSign className="h-5 w-5" />
                        {amount}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={glassStyle}>
          <CardHeader>
            <CardTitle className="text-white">Key Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {breakdown.key_observations.map((observation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle
                    className="h-5 w-5 mt-0.5"
                    style={{ color: GOLD_COLOR }}
                  />
                  <span className="text-white/80">{observation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={glassStyle}>
          <CardHeader>
            <CardTitle className="text-white">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {breakdown.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle
                    className="h-5 w-5"
                    style={{ color: GOLD_COLOR }}
                  />
                  <span className="text-white/80">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {dailySpendingData.some((day) => day.amount > 500) && (
        <Alert className={glassStyle}>
          <AlertCircle className="h-4 w-4" style={{ color: GOLD_COLOR }} />
          <AlertDescription className="text-white/80">
            High spending detected on certain days. Consider reviewing these
            expenses for potential optimizations.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center group">
        <Button
          className="mt-7 px-10 flex print:hidden"
          variant="gold"
          onClick={handleDownload}
        >
          Download
          <ArrowRightIcon className="h-6 w-6 transition duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default BudgetReport;
