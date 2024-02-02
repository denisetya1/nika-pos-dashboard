'use client'

import { Button } from 'flowbite-react'
import { signOut, useSession } from 'next-auth/react'
import { HiUser } from 'react-icons/hi'

const SignOutButton = () => {
  const { data: session } = useSession()
  
  return (
    <div className=' flex justify-between align-middle gap-3'>
      <div className='flex justify-start items-center gap-2 dark:text-gray-200'>
        <HiUser /> {session?.user?.name}
      </div>
      <div>
        <Button color="light" onClick={() => signOut({callbackUrl: '/login'})}>Keluar</Button>
      </div>
    </div>
  )
}

export default SignOutButton