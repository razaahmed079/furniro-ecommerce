"use client";
import Image from "next/image";
import Services from "@/components/Service";
import CheckoutForm from "@/components/CheckoutForm";
import { useState, useEffect } from "react";

export default function ShopHero() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Access localStorage only after component mounts
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

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
        />
        <div className="relative z-10 text-center flex flex-col items-center justify-center h-full w-full">
          <Image
            src="/images/contacticon.png"
            alt="Contact Icon"
            width={50}
            height={50}
            className="mb-2"
          />
          <h3 className="font-medium text-3xl md:text-4xl text-black">
            Checkout
          </h3>
          <h5 className="text-black mt-2 text-sm md:text-lg">
            <span className="font-semibold">Home</span> &gt; Checkout
          </h5>
        </div>
      </div>

      <CheckoutForm cartItems={cartItems} />

      <Services />
    </>
  );
}