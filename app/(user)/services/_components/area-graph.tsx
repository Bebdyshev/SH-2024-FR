'use client';

import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

// The interface representing your chart data
interface ChartDataInter {
  predicted_scores: number[];
  actual_score: number[];
}

const chartConfig = {
  real: {
    label: 'Real',
    color: 'hsl(var(--chart-1))'
  },
  predicted: {
    label: 'Predicted',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

// This is the stack strategy configuration
const stackStrategy = {
  stack: 'total',
  area: true,
  stackOffset: 'none', // To stack 0 on top of others
} as const;

// Customize the chart settings (height, margins, etc.)
const customize = {
  height: 300,
  legend: { hidden: true },
  margin: { top: 5 },
};

export function AreaChart({
  actual_score,
  predicted_scores
}: ChartDataInter) {
  // Prepare the dataset to match the expected format
  const chartData = actual_score.map((value, index) => ({
    quarter: `Q${index + 1}`, // Assuming the data is per quarter
    real: value,
    predicted: predicted_scores[index]
  }));

  const real_actual_score = actual_score.map((value) => {
    return value !== 0 ? value : null;
  });

  const real_predicted_scores = predicted_scores.map((value) => {
    return value !== 0 ? value : null;
  });  

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <LineChart
          grid={{ vertical: true, horizontal: true }}
          xAxis={[{ scaleType: 'point', data: ["I", "II", "III", "IV"] }]}
          series={[
            { data: real_actual_score, label: "Actual score"},
            { data: real_predicted_scores, label: "Predicted score"},
          ]}
          width={400}
          height={400}
        />
    </ChartContainer>
  );
}
