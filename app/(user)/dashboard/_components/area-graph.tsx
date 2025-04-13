"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axiosInstance from "@/app/axios/instance"

const chartConfig = {
  potential: {
    label: "Potential",
    color: "#ff5500",
  },
  real: {
    label: "Real",
    color: "#5754de",
  },
  noVulnerabilities: {
    label: "No Vulnerabilities",
    color: "green",
  },
} satisfies ChartConfig

// Define the type for chart data
interface ChartData {
  hour: string
  potential: number
  real: number
  noVulnerabilities: number
}

export function AreaGraph() {
  const [chartData, setChartData] = useState<ChartData[]>([]) // Explicitly define the state type
  const [vulnerabilityCount, setVulnerabilityCount] = useState({
    allVulnCount: 0,
    potentialVulnCount: 0,
    realVulnCount: 0,
    noVulnCount: 0,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/user/vulnerabilities/count")
        const responseData = response.data // Assuming this is the format
        const { allVulnCount, potentialVulnCount, realVulnCount, noVulnCount } = responseData

        // Create random distribution across 24 hours of the day
        const randomData: ChartData[] = [] // Ensure type is ChartData[]
        for (let i = 0; i < 24; i++) {
          randomData.push({
            hour: `${i}:00`,
            potential: Math.floor(potentialVulnCount),
            real: Math.floor(realVulnCount),
            noVulnerabilities: Math.floor(noVulnCount),
          })
        }

        setChartData(randomData)

        setVulnerabilityCount({
          allVulnCount,
          potentialVulnCount,
          realVulnCount,
          noVulnCount,
        })
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Chart</CardTitle>
        <CardDescription>Comparison of vulnerability types over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[310px] w-full">
          <AreaChart
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
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="potential"
              type="natural"
              fill={chartConfig.potential.color}
              fillOpacity={0.4}
              stroke={chartConfig.potential.color}
              stackId="a"
            />
            <Area
              dataKey="real"
              type="natural"
              fill={chartConfig.real.color}
              fillOpacity={0.4}
              stroke={chartConfig.real.color}
              stackId="a"
            />
            <Area
              dataKey="noVulnerabilities"
              type="natural"
              fill={chartConfig.noVulnerabilities.color}
              fillOpacity={0.4}
              stroke={chartConfig.noVulnerabilities.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Vulnerabilities over the last 24 hours
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
