"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Facebook, Twitter, Instagram } from "lucide-react";
import ReactStars from "react-stars";
import Sidebar from "@/components/CartSideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tab from "@/components/Tab";
import RelatedProducts from "@/components/RelatedProducts";
import {
  Heart,
  Share,
  RotateCcw,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

type ProductDetails = {
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

// Record<string, string> is a shorthand provided by TypeScript for mapping string keys to string values.
const colorMap: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  black: "bg-black",
};

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

export default function ProductDetails({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const query = `
          *[_type == "product" && _id == $id][0]{
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
        const data = await client.fetch(query, { id: params.id });
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);

      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setIsSidebarOpen(true);

    // Show toast notification when product is added to the cart
    toast.success(`${product.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 2500,
    });
  };
  // Function to update the quantity of an item in the cart
  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
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

  const toggleCart = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <p className="text-gray-500 text-lg ml-4">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card className="relative border-none shadow-none">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={urlFor(product.productImage).url()}
                alt={product.title}
                width={600}
                height={600}
                className="rounded-lg w-full h-auto object-cover"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.discountPercentage && (
                  <Badge variant="destructive" className="bg-[#E97171]">
                    -{product.discountPercentage}%
                  </Badge>
                )}
                {product.isNew && (
                  <Badge variant="default" className="bg-[#2EC1AC]">
                    New
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              Rs {product.price.toLocaleString()}
            </span>
            {product.discountPercentage && (
              <span className="text-xl text-gray-400 line-through">
                Rs {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Reviews */}
          <div className="flex items-center space-x-2">
            <ReactStars count={5} size={24} color2={"#FFC700"} />
            <p className="text-muted-foreground">4 Customer Reviews</p>
          </div>

          <Separator className="my-6" />

          {/* Product Description */}
          <ScrollArea className="h-24">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </ScrollArea>

          <Separator className="my-6" />

          {/* Size Selection */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Size</p>
            <div className="flex space-x-3">
              {["L", "XL", "XS"].map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  className="w-12 h-12 rounded-full hover:bg-primary hover:text-primary-foreground"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Color</p>
            <div className="flex space-x-3">
              {["blue", "red", "yellow", "black"].map((color) => (
                <Button
                  key={color}
                  variant="ghost"
                  className={`w-8 h-8 rounded-full p-0 ${colorMap[color]} hover:ring-2 hover:ring-offset-2`}
                />
              ))}
            </div>
          </div>

          {/* Social Share */}
          <div className="flex flex-wrap gap-4 pt-4">
            {[
              { Icon: Facebook, color: "text-blue-600", label: "Facebook" },
              { Icon: Twitter, color: "text-blue-400", label: "Twitter" },
              { Icon: Instagram, color: "text-pink-500", label: "Instagram" },
            ].map(({ Icon, color, label }) => (
              <Button
                key={label}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="hidden sm:inline">Share on {label}</span>
              </Button>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Add to Cart Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                className="hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-6 py-2 text-lg font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => addToCart(product)}
              className="bg-[#B88E2F] hover:bg-[#9e7a28] text-white px-8 py-6 rounded-lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 text-muted-foreground">
            <Link href="/wishlist">
              <Button variant="ghost" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Wishlist
              </Button>
            </Link>

            <Button variant="ghost" className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Share
            </Button>

            <Link href="/productcomparision">
              <Button variant="ghost" className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Compare
              </Button>
            </Link>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="pt-4">
              <p className="text-muted-foreground">
                Tags:{" "}
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="mr-2">
                    {tag}
                  </Badge>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>

      <Sidebar
        updateQuantity={updateQuantity}
        cartOpen={isSidebarOpen}
        toggleCart={toggleCart}
        cartItems={cartItems}
        removeItem={removeItem}
      />

      <Tab />
      <RelatedProducts />
      <ToastContainer />
    </div>
  );
}
