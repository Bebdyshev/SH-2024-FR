'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const rawData = [
  { _count: { id: 1 }, createdAt: '2024-12-07T11:41:46.762Z' },
  { _count: { id: 1 }, createdAt: '2024-12-07T11:43:55.501Z' },
  { _count: { id: 1 }, createdAt: '2024-12-07T12:20:04.646Z' },
  { _count: { id: 1 }, createdAt: '2024-12-07T12:20:05.371Z' }
];

// Генерация всех часов от 00:00 до 23:00
const generateFullHours = () =>
  Array.from({ length: 24 }, (_, i) => ({
    hour: i.toString().padStart(2, '0'),
    count: 0
  }));

// Преобразование данных: группировка по часам
const groupedData = rawData.reduce((acc, { createdAt }) => {
  const hour = new Date(createdAt).getHours().toString().padStart(2, '0');
  if (!acc[hour]) {
    acc[hour] = { hour, count: 0 };
  }
  acc[hour].count += 1;
  return acc;
}, {} as Record<string, { hour: string; count: number }>);

// Объединение данных с часовым диапазоном
const chartData = generateFullHours().map((hour) => ({
  ...hour,
  count: groupedData[hour.hour]?.count || 0
}));

const chartConfig = {
  views: {
    label: 'Уязвимостей'
  },
  desktop: {
    label: 'Потенциальные',
    color: '#5754de'
  },
  mobile: {
    label: 'Серьезные',
    color: '#ff5500'
  }
} satisfies ChartConfig;



export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('desktop');

  const total = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => {
        acc.desktop += curr.count; // Replace with actual desktop logic
        acc.mobile += curr.count; // Replace with actual mobile logic
        return acc;
      },
      { desktop: 0, mobile: 0 }
    );
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Уязвимости за последние 24 часа</CardTitle>
          <CardDescription>
            Все уязвимости по часам за последние 24 часа
          </CardDescription>
        </div>
        <div className="flex">
          {['desktop', 'mobile'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => `${value}:00`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => `${value}:00`}
                />
              }
            />
            <Bar dataKey="count" fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
