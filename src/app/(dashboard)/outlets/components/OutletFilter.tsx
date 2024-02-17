'use client'

import { Outlet } from '@prisma/client'
import { Label, Select } from 'flowbite-react'
import { usePathname, useRouter } from 'next/navigation'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'

const OutletFilter = ({
  outlets,
  selectedOutlet
}: {
  outlets: Outlet[],
  selectedOutlet?: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [outletId, setOutletId] = useState(selectedOutlet);

  useEffect(() => {
    const query = {
      outletId
    }

    const qs = queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true
    })

    router.push(`${pathname}?${qs}`)
  }, [outletId])

  return (
    <div className='mb-10'>
      {outlets && outlets?.length > 0 ? <div className='flex flex-row justify-start items-center gap-5'>
        <div className="flex justify-start align-middle">
          <Label htmlFor="product-name" value="Outlet" />
        </div>

        <Select className='w-[400px]' color="info" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOutletId(e.target.value)} value={outletId}>
          {outlets.map((outlet) => (<option key={outlet.id} value={outlet.id.toString()}>{outlet.name}</option>))}
        </Select>

      </div>: <></>} 
    </div>
  )
}

export default OutletFilter