import Image from "next/image"

const POSPage = () => {
  return (
    <div className="w-full h-screen flex justify-start align-top">
      <div className="w-[400px] h-screen bg-red-300 p-8">
        <div className="receipt-logo">
          <Image
                  alt="NIKA POS - BEAUTYCAT"
                  height="24"
                  src="/logo-stroked.png"
                  width="150"
                />
        </div>
      </div>
      <div className="grow h-screen bg-blue-300 p-10">
        dsa
      </div>
    </div>
  )
}

export default POSPage