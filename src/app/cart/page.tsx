"use client";

import Image from "next/image";
import Services from "@/components/Service";
import Cart from "@/components/Cart";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

export default function ShopHero() {

  const [cartItems, setCartItems] = useState<
    { _id: string; title: string; productImage: string; price: number; quantity: number }[]
  >([]);

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Handle item removal
  const handleRemoveItem = (id: string) => {
     setCartItems((prev) => {
          const updatedCart = prev.filter((item) => item._id !== id);
          
          // Save to localStorage
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          
          // Dispatch custom event
          window.dispatchEvent(new Event('cartUpdated'));
          
          return updatedCart;
        });
      
        toast.error("Item removed from cart", {
          position: "bottom-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      };

  // Handle quantity update
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

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
          <h3 className="font-medium text-3xl md:text-4xl text-black">Cart</h3>
          <h5 className="text-black mt-2 text-sm md:text-lg">
            <span className="font-semibold">Home</span> &gt; Cart
          </h5>
        </div>
      </div>

      <Cart
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onQuantityChange={handleQuantityChange}
      />

      <ToastContainer />

      <Services />
    </>
  );
}
