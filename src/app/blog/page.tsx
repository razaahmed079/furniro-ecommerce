import Image from "next/image";
import Services from "@/components/Service";
import Blogs from "@/components/Blogs";

export default function ShopHero() {
  return (
    <>
      {/* Hero Section */}
      <div className="shopsect relative h-80 w-full overflow-hidden">
        <Image
          src="/images/shopbg.png"
          alt="Shop Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          priority // Ensures the hero image loads first
        />
        <div className="relative z-10 text-center flex flex-col items-center justify-center h-full w-full">
          <Image
            src="/images/contacticon.png"
            alt="Contact Icon"
            width={50}
            height={50}
            className="mb-2"
          />
          <h3 className="font-medium text-3xl md:text-4xl text-black">Blog</h3>
          <h5 className="text-black mt-2 text-sm md:text-lg">
            <span className="font-semibold">Home</span> &gt; Blog
          </h5>
        </div>
      </div>

      {/* Blogs Component */}
      <Blogs />

      {/* Pagination Section */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 my-8 px-4">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className="px-4 py-2 text-center bg-[#F9F1E7] text-gray-700 font-semibold rounded-md hover:bg-[#e0d4be] hover:text-gray-900 transition-all duration-300"
          >
            {page}
          </button>
        ))}
        <button className="px-4 py-2 bg-[#F9F1E7] text-gray-700 rounded-md font-semibold hover:bg-[#e0d4be] hover:text-gray-900 transition-all duration-300">
          Next
        </button>
      </div>

      {/* Services Component */}
      <Services />
    </>
  );
}
