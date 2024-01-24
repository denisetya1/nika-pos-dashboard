'use client'

import { Outlet } from '@prisma/client'
import { Label, Select } from 'flowbite-react'
import React, { useState } from 'react'

const OutletFilter = ({
  outlets,
  selectedOutlet
}: {
  outlets: Outlet[],
  selectedOutlet?: string
}) => {
  const [outletId, setOutletId] = useState(selectedOutlet);

  return (
    <div>
      {outlets && outlets?.length > 0 ? <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Outlet" />
        </div>
        <Select color="info" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOutletId(e.target.value)} value={outletId}>
          {outlets.map((outlet) => (<option key={outlet.id} value={outlet.id.toString()}>{outlet.name}</option>))}
        </Select>
      </div>: <></>} 
    </div>
  )
}

export default OutletFilter