'use client'

import { Button, Label, TextInput } from "flowbite-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  username: string,
  password: string
}

const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState(false)
  const {data: session} = useSession()

  useEffect(() => {
    if(session?.user){
      router.replace('/')
    }
  }, [session])

  useEffect(() => {
    if(error === true){
      setTimeout(() => {
        setError(false)
      }, 10000)
    }
  }, [error])

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const SubmitLogin: SubmitHandler<FormValues> = async (formData: FormValues) => {
    const {username, password} = formData

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: '/'
    })


    if(result?.ok === true){
      router.replace('/')
    } else {
      setError(true)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              {/* <Image className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"> */}
              Nika    
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Sign in to your account
                  </h1>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(SubmitLogin)}>
                    {error && <div className="mb-3 rounded-lg p-4 bg-red-100">
                      <div className="text-red-600">Username/Password tidak ditemukan!</div>
                    </div>}
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="username" value="Username/Email" />
                      </div>
                      <TextInput id="username" type="text" {...register('username')} placeholder="name@mail.com" required />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="password" value="Password" />
                      </div>
                      <TextInput id="password" type="password" {...register('password')} required />
                    </div>
                    <Button type="submit">Masuk</Button>
                  </form>
              </div>
          </div>
      </div>
    </div>
  )
}

export default LoginForm