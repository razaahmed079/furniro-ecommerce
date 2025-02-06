"use client";
import Image from "next/image";
import Services from "@/components/Service";
import Comparison from "@/components/Comparision";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";

type Product = {
  _id: string;
  title: string;
  productImage: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isNew: boolean;
  tags: string[];
  description?: string;
  quantity: number;
};

export default function ShopHero() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Access localStorage only after component mounts
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `
          *[_type == "product"]{
            _id,
            title,
            "productImage": productImage.asset->url,
            price,
            originalPrice,
            discountPercentage, 
            isNew,
            tags,
            description
          }
        `;
        const data: Product[] = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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
            Product Comparision
          </h3>
          <h5 className="text-black mt-2 text-sm md:text-lg">
            <span className="font-semibold">Home</span> &gt; Comparision
          </h5>
        </div>
      </div>

      {/* Conditional Rendering */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p>Loading products...</p>
        </div>
      ) : (
        <Comparison
          cartItems={cartItems}
          allProducts={products.slice(0, 5)} // Limit to 5 products
        />
      )}

      <Services />
    </>
  );
}