"use client";
import Image from "next/image";
import BlowHero from "@/components/ShopHero";
import Services from "@/components/Service";
import { Icon } from "@iconify/react";
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/CartSideBar";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Product = {
  _id: string; // Sanity uses _id for unique identifiers
  title: string;
  productImage: string; // URL for the product image
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isNew: boolean;
  tags: string[];
  description?: string;
  quantity: number;
};

export default function ShopHero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const productsPerPage = 8; // Number of products per page

  const router = useRouter();

  const addToWishlist = (product: Product) => {
    const isAlreadyInWishlist = wishlist.some(
      (item) => item._id === product._id
    );

    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      // Dispatch custom event
      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.dismiss();
      toast.success(`${product.title} added to wishlist!`, {
        position: "bottom-right",
        autoClose: 2500,
      });
    } else {
      toast.info(`${product.title} is already in your wishlist!`);
    }
  };

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // Dispatch custom event
    window.dispatchEvent(new Event("wishlistUpdated"));

    toast.error("Product removed from wishlist!", {
      position: "bottom-right",
      autoClose: 2500,
    });
  };

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Fetch products from Sanity
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
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts();
  }, []);

  // Function to add item to cart and open sidebar
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        updatedCart = [...prev, { ...product, quantity: 1 }];
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Dispatch custom event
      window.dispatchEvent(new Event("cartUpdated"));

      return updatedCart;
    });

    setIsSidebarOpen(true);

    toast.success(`${product.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 2500,
    });
  };
  // Function to remove item from cart
  const removeItem = (id: string) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item._id !== id);

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Dispatch custom event
      window.dispatchEvent(new Event("cartUpdated"));

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

  // Toggle sidebar
  const toggleCart = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };
  // Filtered products based on search term
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [products, searchTerm]);

  // Calculate products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle next and previous buttons
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
          <h3 className="font-medium text-3xl md:text-4xl text-black">Shop</h3>
          <h5 className="text-black mt-2 text-sm md:text-lg">
            <span className="font-semibold">Home</span> &gt; Shop
          </h5>
        </div>
      </div>
      {/* Filters and Sorting */}
      <BlowHero />

      {/* Search Bar */}

      <div className="mb-6 mt-6 px-8">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Search by name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
          <p className="text-gray-500 text-lg ml-4">Loading products...</p>
        </div>
      ) : (
        // Product Grid
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8">
          {currentProducts.length > 0 ? (
            currentProducts.map((product: Product) => (
              <div
                key={product._id}
                className="cursor-pointer bg-[#F4F5F7] rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 group relative"
              >
                <div className="relative">
                  <Image
                    src={urlFor(product.productImage).url()}
                    alt={product.title}
                    width={300}
                    height={225}
                    className="w-full h-64 object-cover"
                    loading="lazy" // Lazy loading
                  />

                  {product.discountPercentage && (
                    <span className="absolute top-2 right-2 bg-[#E97171] text-white px-2 py-1 rounded-lg text-sm">
                      -{product.discountPercentage}%
                    </span>
                  )}
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-[#2EC1AC] text-white px-2 py-1 rounded-lg text-sm">
                      New
                    </span>
                  )}

                  <div className="h-full absolute bottom-0 w-full flex flex-col gap-6 items-center justify-center bg-opacity-0 opacity-0 group-hover:bg-opacity-70 group-hover:opacity-100 bg-[#3A3A3A] transition-opacity duration-300">
                    {/* Add to Cart Button */}
                    <button
                      className="text-[16px] font-medium text-[#B88E2F] bg-white px-8 py-3 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the product click
                        addToCart(product);
                      }}
                    >
                      Add to Cart
                    </button>

                    <div className="absolute top-2 right-2 flex items-center">
                      <Icon
                        icon="mdi:heart"
                        className={`text-2xl cursor-pointer ${
                          wishlist.some((item) => item._id === product._id)
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            wishlist.some((item) => item._id === product._id)
                          ) {
                            removeFromWishlist(product._id);
                          } else {
                            addToWishlist(product);
                          }
                        }}
                      />
                    </div>

                    {/* Share and Compare Buttons */}
                    <div className="flex gap-4 text-white text-sm mt-2">
                      <button className="flex items-center gap-1 text-[16px] font-semibold">
                        <Icon icon="gridicons:share" /> Share
                      </button>
                      <button className="flex items-center gap-1 text-[16px] font-semibold">
                        <Icon icon="fluent:arrow-swap-20-regular" /> Compare
                      </button>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  className="bg-[#B88E2F] text-white py-2 px-4 w-full rounded-b-lg hover:bg-[#9e7a28] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the product click
                    router.push(`/product/${product._id}`);
                  }}
                >
                  View Details
                </button>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.description && product.description.length > 120
                      ? `${product.description.slice(0, 120)}...`
                      : product.description}
                  </p>
                  <div className="mt-2">
                    {product.discountPercentage ? (
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-gray-900">
                          Rs {product.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                          Rs {product.originalPrice.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-gray-900">
                        Rs {product.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No products found.</p>
            </div>
          )}
        </div>
      )}

      <Sidebar
        updateQuantity={updateQuantity}
        cartOpen={isSidebarOpen}
        toggleCart={toggleCart}
        cartItems={cartItems}
        removeItem={removeItem}
      />

      {/* Pagination Section */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 my-8 px-4">
        <button
          className="px-4 py-2 text-center bg-[#B88E2F] text-white font-semibold rounded-md hover:bg-[#9a7825] hover:shadow-lg transition-all duration-300"
          onClick={prevPage}
        >
          Previous
        </button>
        {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map(
          (_, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-center bg-[#B88E2F] text-white font-semibold rounded-md ${
                currentPage === index + 1
                  ? "bg-[#9a7825]"
                  : "hover:bg-[#9a7825] hover:shadow-lg"
              } transition-all duration-300`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
        <button
          className="px-4 py-2 text-center bg-[#B88E2F] text-white font-semibold rounded-md hover:bg-[#9a7825] hover:shadow-lg transition-all duration-300"
          onClick={nextPage}
        >
          Next
        </button>
      </div>
      <Services />

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}
