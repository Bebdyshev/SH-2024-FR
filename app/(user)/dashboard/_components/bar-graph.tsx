"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axiosInstance from "@/app/axios/instance"

export const description = "An interactive bar chart"

const generateFullHours = () =>
  Array.from({ length: 24 }, (_, i) => ({
    hour: i.toString().padStart(2, "0"),
    count: 0,
  }))

export function BarGraph() {
  const [chartData, setChartData] = useState(generateFullHours())
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("desktop")
  const [totals, setTotals] = useState({ desktop: 0, mobile: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/user/vulnerabilities/by-days")
        const data = response.data

        const groupedData = data.reduce((acc: Record<string, { hour: string; count: number }>, item: any) => {
          const hour = new Date(item.createdAt).getHours().toString().padStart(2, "0")
          if (!acc[hour]) acc[hour] = { hour, count: 0 }
          acc[hour].count += 1
          return acc
        }, {})

        const processedChartData = generateFullHours().map((hour) => ({
          ...hour,
          count: groupedData[hour.hour]?.count || 0,
        }))

        const desktopTotal = processedChartData.reduce((sum, entry) => sum + entry.count, 0)
        const mobileTotal = desktopTotal // Replace with real logic if required.

        setChartData(processedChartData)
        setTotals({ desktop: desktopTotal, mobile: mobileTotal })
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const chartConfig = {
    views: {
      label: "Vulnerabilities",
    },
    desktop: {
      label: "Potential",
      color: "#5754de",
    },
    mobile: {
      label: "Critical",
      color: "#ff5500",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Vulnerabilities over the last 24 hours</CardTitle>
          <CardDescription>All vulnerabilities by hour over the last 24 hours</CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {chartConfig[chart].label === "Critical" ? 0 : 3}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
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
                <ChartTooltipContent className="w-[150px]" nameKey="views" labelFormatter={(value) => `${value}:00`} />
              }
            />
            <Bar dataKey="count" fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
