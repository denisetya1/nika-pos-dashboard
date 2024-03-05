import { getServerSession } from "next-auth"
import LoginForm from "./components/LoginForm"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"

const LoginPage = async () => {
  const session = await getServerSession(authOptions)

  if(session && session?.user){
    redirect('/')
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <LoginForm />
    </div>
  )
}

export default LoginPage