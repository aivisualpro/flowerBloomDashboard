"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { User, columns } from "./columns"
import { getUsersLists } from "@/api/users"
import { Card, CardContent } from "@/components/ui/card"

export default function CustomersPage() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getUsersLists()
        const users = Array.isArray(result) 
          ? result 
          : Array.isArray(result?.data) 
            ? result.data 
            : Array.isArray(result?.users)
                ? result.users
                : []
        
        // Filter to only CUSTOMER role
        const customers = users.filter((u: any) => String(u.role || "").toUpperCase() === "CUSTOMER")
        setData(customers)
      } catch (error) {
        console.error("Failed to fetch customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-md bg-white">
        <CardContent>
          <DataTable columns={columns} data={data} searchKey="firstName" loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
