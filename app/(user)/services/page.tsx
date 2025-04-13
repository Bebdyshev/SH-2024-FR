"use client"

import type React from "react"

import { useState, useEffect } from "react"
import PageContainer from "@/components/layout/page-container"
import axiosInstance from "@/app/axios/instance"
import { ServicePopup } from "./_components/servicePopup"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

export default function ServicesPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [data, setServiceData] = useState<any>([]) // Initialize as empty array
  const router = useRouter()

  // Add state for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<any>(null)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        console.error("JWT token not found.")
        return
      }

      const response = await axiosInstance.get("/services/my-services")

      // Make sure we're handling the response data correctly
      const services = response.data || []

      // Sort the data immediately after fetching
      const sortedData = services.sort((a: any, b: any) => {
        const priority = ["potential vulnerability", "processing..."]
        const verdictA = a.verdict || ""
        const verdictB = b.verdict || ""

        // Give priority to rows with colored verdicts
        if (priority.includes(verdictA) && !priority.includes(verdictB)) return -1
        if (!priority.includes(verdictA) && priority.includes(verdictB)) return 1
        return 0 // If both are the same, leave their order unchanged
      })

      setServiceData(sortedData) // Set sorted data in state
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const openPopup = (item: any) => {
    setSelectedItem(item)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedItem(null)
  }

  const getRowColor = (verdict: string) => {
    if (verdict === "processing...") return "bg-white hover:bg-gray-100"
    if (verdict === "potential vulnerability") return "bg-orange-100 hover:bg-orange-200"
    return "bg-green-100 hover:bg-green-200"
  }

  const capitalize = (str: string) => {
    if (!str) return ""
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const handleAddService = () => {
    router.push("/check")
  }

  // Add delete function
  const deleteService = async (serviceId: string) => {
    try {
      await axiosInstance.delete(`/services/delete/${serviceId}`)
      // Refresh the services list
      fetchData()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  // Add function to open delete dialog
  const openDeleteDialog = (e: React.MouseEvent, service: any) => {
    e.stopPropagation() // Prevent row click event
    setServiceToDelete(service)
    setIsDeleteDialogOpen(true)
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Overview</h1>
        <Button onClick={handleAddService} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors ease-in-out cursor-pointer"
                  onClick={() => openPopup(item)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.domain}`}
                        className="w-5 h-5 mr-3 rounded-full"
                        alt={item.domain}
                      />
                      <span className="font-medium">{item.domain}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.ip}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "vulnerable"
                          ? "bg-red-100 text-red-800"
                          : item.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {capitalize(item.status || "Active")}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={(e) => openDeleteDialog(e, item)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">
            No services found. Add your first service to start scanning for vulnerabilities.
          </p>
          <Button onClick={handleAddService} className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      )}

      {isPopupOpen && selectedItem && <ServicePopup data={selectedItem} onClose={closePopup} />}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service {serviceToDelete?.domain}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteService(serviceToDelete?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
