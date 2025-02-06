import Image from "next/image";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/Form";

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
            priority
          />
          <h3 className="font-medium text-3xl md:text-4xl text-black">Contact</h3>
          <h5 className="text-black mt-2 text-sm md:text-lg">
            <span className="font-semibold">Home</span> &gt; Contact
          </h5>
        </div>
      </div>

      {/* Contact Form */}
      <ContactForm />

      {/* FAQ Section */}
      <FAQ />
    </>
  );
}
