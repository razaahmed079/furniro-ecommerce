import Hero from "@/components/HeroOne";
import Hero2 from "@/components/Herosectiontwo";
import CustomComponent from "@/components/BeautifulRooms";
import Products from "@/components/Products";
import ShareSetupSection from "@/components/Setup";

export default function Home() {
  return (
    <div>
      <Hero />
      <Hero2 />
      <Products />
      <CustomComponent />
      <ShareSetupSection />
      
    </div>
  );
}
