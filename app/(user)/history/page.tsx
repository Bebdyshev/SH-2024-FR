"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/app/axios/instance"
import PageContainer from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/reports/")
        setHistory(response.data || [])
      } catch (err) {
        setError("Error loading data")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "vulnerable":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "not vulnerable":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="p-6 bg-red-50 text-red-600 rounded-lg">
          <AlertTriangle className="h-6 w-6 mb-2" />
          <p>{error}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Scan History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">IP/Domain</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Exploit</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{entry.id}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center">
                          <img
                            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${entry.domain}`}
                            className="w-5 h-5 mr-2 rounded-full"
                            alt={entry.domain || entry.ip}
                          />
                          <span>{entry.domain || entry.ip}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center">
                          {getStatusIcon(entry.status)}
                          <span className="ml-2">{entry.status}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{entry.exploit || "N/A"}</td>
                      <td className="border border-gray-200 px-4 py-2">{formatDate(entry.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No scan history available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default HistoryPage
