"use client"

import { useState, useEffect } from "react"
import PageContainer from "@/components/layout/page-container"
import axiosInstance from "@/app/axios/instance"
import { useRouter } from "next/navigation"
import HistoryPopup from "./_components/historyPopup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function CheckPage() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [ipAddress, setIpAddress] = useState("")
  const [domain, setDomain] = useState("")
  const [ipError, setIpError] = useState("")
  const [domainError, setDomainError] = useState("")
  const [touched, setTouched] = useState({ ip: false, domain: false })
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const router = useRouter()

  const validateIpAddress = (ip: string) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/
    if (!ipRegex.test(ip)) {
      return "Invalid IP address. Example: <b>0.0.0.0</b>"
    }
    return ""
  }

  const validateDomain = (dom: string) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/
    if (!domainRegex.test(dom)) {
      return "Invalid domain name. Example: <b>google.com</b>"
    }
    return ""
  }

  useEffect(() => {
    const ipValidationError = validateIpAddress(ipAddress)
    const domainValidationError = validateDomain(domain)

    setIpError(ipValidationError)
    setDomainError(domainValidationError)

    setIsButtonVisible(
      ipValidationError === "" && domainValidationError === "" && ipAddress.trim() !== "" && domain.trim() !== "",
    )
  }, [ipAddress, domain])

  const handleFocus = (field: "ip" | "domain") => {
    setTouched({ ...touched, [field]: true })
  }

  const submitForm = async () => {
    try {
      const response = await axiosInstance.post("/services/new", {
        ip: ipAddress,
        domain: domain,
      })

      console.log("Service created:", response.data)
      router.push("/services")
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen)
  }

  return (
    <PageContainer scrollable>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Vulnerability Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="ipAddress" className="text-sm font-medium">
              IP Address
            </label>
            <Input
              id="ipAddress"
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onFocus={() => handleFocus("ip")}
              placeholder="Enter service IP address"
              className={`${ipError && touched.ip ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500"}`}
            />
            {touched.ip && ipError && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span dangerouslySetInnerHTML={{ __html: ipError }} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="domain" className="text-sm font-medium">
              Domain
            </label>
            <Input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onFocus={() => handleFocus("domain")}
              placeholder="Enter service domain"
              className={`${
                domainError && touched.domain ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500"
              }`}
            />
            {touched.domain && domainError && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span dangerouslySetInnerHTML={{ __html: domainError }} />
              </div>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={submitForm}
              disabled={!isButtonVisible}
              className={`w-full max-w-xs bg-purple-600 hover:bg-purple-700 transition-all ${
                isButtonVisible ? "opacity-100" : "opacity-50"
              }`}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {isHistoryOpen && <HistoryPopup onClose={toggleHistory} />}
    </PageContainer>
  )
}
