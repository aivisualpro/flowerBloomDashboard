"use client"

import { useEffect, useState } from "react"
import { ParticleTextEffect } from "@/components/ParticleTextEffect"
import { DataTable } from "@/components/ui/data-table"
import { User, columns } from "./columns"
import { getUsersLists } from "@/api/users"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function CustomersPage() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getUsersLists()
        // Defensive check to handle various API response structures
        // Assuming result could be the array itself, or { data: [...] }, or { users: [...] }
        const users = Array.isArray(result) 
          ? result 
          : Array.isArray(result?.data) 
            ? result.data 
            : Array.isArray(result?.users)
                ? result.users
                : []
        
        setData(users)
      } catch (error) {
        console.error("Failed to fetch customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="w-full flex justify-center mb-[-20px]">
         <ParticleTextEffect words={["Customers"]} />
      </div>
      
      <div>
        <Card className="border-none shadow-md bg-white">

          <CardContent>
            <DataTable columns={columns} data={data} searchKey="name" loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
