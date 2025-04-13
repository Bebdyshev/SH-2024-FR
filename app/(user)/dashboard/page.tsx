"use client"
import { useEffect, useState } from "react"
import { AreaGraph } from "./_components/area-graph"
import { BarGraph } from "./_components/bar-graph"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import PageContainer from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { ExploitTable } from "./_components/exploits-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import axiosInstance from "@/app/axios/instance"
import { AlertTriangle, CircleAlert, OctagonAlert, Smile } from "lucide-react"

const downloadPDF = (data: any) => {
  if (!data) {
    console.error("No user data available to generate PDF.")
    return // Prevent PDF generation if data is not available
  }

  const doc = new jsPDF()

  // Use the standard font
  doc.setFont("helvetica", "bold")

  doc.setFontSize(18)
  doc.text("Report on User Data and Services", 10, 10)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  // User data section
  const info = data["User Info"].user
  doc.text(`Email: ${info.email}`, 10, 20)
  doc.text(`Updated at ${new Date(info.createdAt).toLocaleString()}`, 10, 30)

  // Services data section
  const services = info.services
  const servicesTableData = services.map((service: any) => [
    service.id,
    service.ip,
    service.domain,
    new Date(service.createdAt).toLocaleString(),
  ])

  const head = ["Service ID", "IP Address", "Domain", "Created At"]
  autoTable(doc, {
    head: [head],
    body: servicesTableData,
    startY: 40, // Table position
  })

  // Save PDF
  const today = new Date()
  const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
  doc.save("User-Report-" + formattedDate + ".pdf")
}

export default function DashboardPage() {
  const [vulnerabilityCount, setVulnerabilityCount] = useState({
    allVulnCount: 0,
    potentialVulnCount: 0,
    realVulnCount: 0,
    noVulnCount: 0,
  })
  const [userInfo, setUserInfo] = useState<any>()
  const [username, setUsername] = useState("User")
  // Add state for exploits
  const [exploits, setExploits] = useState([])

  // Add useEffect to fetch exploits
  useEffect(() => {
    async function fetchExploits() {
      try {
        const response = await axiosInstance.get("/exploits/")
        setExploits(response.data || [])
      } catch (error) {
        console.error("Error loading exploits:", error)
      }
    }

    fetchExploits()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/user/vulnerabilities/count")
        setVulnerabilityCount(response.data) // Assuming API returns an array of data
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/auth/me")
        setUserInfo(response.data)
        if (response.data?.user?.email) {
          setUsername(response.data.user.email.split("@")[0])
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    fetchData()
  }, [])

  const reportData = {
    "Total Vulnerabilities": vulnerabilityCount.potentialVulnCount + vulnerabilityCount.realVulnCount,
    "Potential Vulnerabilities": vulnerabilityCount.potentialVulnCount,
    "Real Vulnerabilities": vulnerabilityCount.realVulnCount,
    "No Vulnerabilities": vulnerabilityCount.noVulnCount,
    "Total Services": userInfo?.user?.services?.length || 0,
    "User Info": userInfo ? userInfo : "Not Available",
    // Add any other data you want to include in the report
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome, {username}!</h2>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => downloadPDF(reportData)}>
              Download Report
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
              <Card className="hover:border-red-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-red-500 transition duration-300">
                    Total Vulnerabilities
                  </CardTitle>
                  <AlertTriangle className="h-5 w-5 group-hover:text-red-500 transition duration-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold group-hover:text-red-500 transition duration-300">
                    {vulnerabilityCount.potentialVulnCount + vulnerabilityCount.realVulnCount}
                  </div>
                  <p className="text-xs text-muted-foreground group-hover:text-red-500 transition duration-300">
                    +{vulnerabilityCount.potentialVulnCount + vulnerabilityCount.realVulnCount} from last week
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-yellow-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-yellow-500 transition duration-300">
                  <CardTitle className="text-sm font-medium group-hover:text-yellow-500 transition duration-300">
                    Potential Vulnerabilities
                  </CardTitle>
                  <CircleAlert className="h-5 w-5 group-hover:text-yellow-500 transition duration-300" />
                </CardHeader>
                <CardContent className="group-hover:text-yellow-500 transition duration-300">
                  <div className="text-2xl font-bold">{vulnerabilityCount.potentialVulnCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +{vulnerabilityCount.potentialVulnCount} from last week
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-orange-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-orange-500 transition duration-300">
                  <CardTitle className="text-sm font-medium group-hover:text-orange-500 transition duration-300">
                    Critical Vulnerabilities
                  </CardTitle>
                  <OctagonAlert className="h-5 w-5 group-hover:text-orange-500 transition duration-300" />
                </CardHeader>
                <CardContent className="group-hover:text-orange-500 transition duration-300">
                  <div className="text-2xl font-bold">{vulnerabilityCount.realVulnCount}</div>
                  <p className="text-xs text-muted-foreground">+{vulnerabilityCount.realVulnCount} from last week</p>
                </CardContent>
              </Card>
              <Card className="hover:border-green-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-green-500 transition duration-300">
                  <CardTitle className="text-sm font-medium">No Vulnerabilities</CardTitle>
                  <Smile className="h-5 w-5 group-hover:text-green-500 transition duration-300" />
                </CardHeader>
                <CardContent className="group-hover:text-green-500 transition duration-300">
                  <div className="text-2xl font-bold">{vulnerabilityCount.noVulnCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +{vulnerabilityCount.noVulnCount ? 0 : 0} from last week
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-8 w-full">
                <BarGraph />
              </div>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Services with Vulnerabilities</CardTitle>
                  <CardDescription>Total services: {userInfo?.user?.services?.length || 0}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExploitTable />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}
