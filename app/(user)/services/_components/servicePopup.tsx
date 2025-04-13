"use client"
import { X } from "lucide-react"
import { useState } from "react"
import axiosInstance from "@/app/axios/instance"
import { Button } from "@/components/ui/button"

interface ServicePopupProps {
  data: any
  onClose: () => void
}

export function ServicePopup({ data, onClose }: ServicePopupProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState("")

  const analyzeService = async () => {
    try {
      setAnalyzing(true)
      const response = await axiosInstance.post("/services/analyze-service", {
        service_id: data.id,
        description:
          data.service?.description || `Service with domain ${data.service?.domain} and IP ${data.service?.ip}`,
      })
      setAnalysisResult(response.data.message || "Analysis complete")
    } catch (error) {
      console.error("Error analyzing service:", error)
      setAnalysisResult("Analysis failed. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600"
      case "processing":
        return "text-blue-600"
      case "vulnerable":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getVerdictColor = (verdict: string) => {
    if (verdict === "potential vulnerability") return "text-orange-600"
    if (verdict === "processing...") return "text-blue-600"
    return "text-green-600"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-3xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Service Details</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Service Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Service Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Domain</p>
                <p className="font-medium">{data.service.domain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <p className="font-medium">{data.service.ip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{formatDate(data.service.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${getStatusColor(data.agent.status)}`}>{data.agent.status}</p>
              </div>
            </div>
          </div>

          {/* Exploit Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Exploit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Exploit Title</p>
                <p className="font-medium">{data.exploit.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verdict</p>
                <p className={`font-medium ${getVerdictColor(data.verdict)}`}>{data.verdict}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{data.exploit.description || "No description available"}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          {data.exploit.technical_details && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Technical Details</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">{data.exploit.technical_details}</pre>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {data.exploit.recommendations && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm">{data.exploit.recommendations}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between">
          <div>
            {analysisResult && (
              <p className={`text-sm ${analysisResult.includes("failed") ? "text-red-600" : "text-green-600"}`}>
                {analysisResult}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={analyzeService} disabled={analyzing} className="bg-purple-600 hover:bg-purple-700">
              {analyzing ? "Analyzing..." : "Analyze Service"}
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
