import IMG from '@/lib/constants'
import Image from 'next/image'
import React from 'react'

const LeftScreen = () => {
  return (
    <div className="size-full bg-[#D8FAE9]">

        {/* vector-image */}

        <div className="h-80">
          <Image src={IMG.CurvedVector} alt="vector" className="w-full" />
        </div>

        {/* title and description */}

        <div className="flex w-full flex-col items-center text-black">
          <h1 className="py-1 text-xl font-bold">Start your Journey 🥳</h1>
          <p className="text-xs text-gray-500">
            Lorem ipsum dolor sit amet consectetur. Vitae a <br />
            nunc volutpat enim ac. Lorem ipsum dolor sit.
          </p>
        </div>

        {/* learn button */}

        <div className="flex w-full justify-center py-4">
          <button className="flex items-center gap-1 text-black underline">
            Learn more{" "}
            <span>
              <Image src={IMG?.ArrowRounded} alt=">" />
            </span>
          </button>
        </div>

        {/* users images */}

        <div className="w-full px-6 py-2">
          <div className="flex w-full items-center">
            <div className="relative flex w-1/2 justify-end">
              <Image
                src={IMG?.Profile1}
                width={130}
                alt="vector-Profile1"
                className=""
              />
            </div>
            <div className="relative flex w-1/2 justify-center">
              <Image src={IMG?.Profile2} alt="vector-Profile2" width={70} />
            </div>
          </div>
          <div className="-mt-4 flex w-full items-center">
            <div className="relative flex w-1/2 justify-center">
              <Image
                src={IMG?.Profile3}
                width={60}
                alt="vector-Profile3"
                className=""
              />
            </div>
            <div className="relative w-1/2 justify-start">
              <Image src={IMG?.Profile4} alt="vector-Profile4" width={100} />
            </div>
          </div>
        </div>
      </div>
  )
}

export default LeftScreen
