import { Navbar }            from "./components/layout/Navbar";
import { HeroSection }      from "./components/layout/HeroSection";
import { StatsBar }          from "./components/sections/StatsBar";
import { SignatureDishes }   from "./components/sections/SignatureDishes";
import { BestSellers }       from "./components/menu/BestSellers";
import { RoyalExperience }   from "./components/sections/RoyalExperience";
import { ChefSpecial }       from "./components/sections/ChefSpecial";
import { Testimonials }      from "./components/layout/Testimonials";
import { Gallery }           from "./components/sections/Gallery";
import { ReservationCTA }    from "./components/layout/ReservationCTA";
import { Footer }            from "./components/layout/Footer";

export default function HomePage() {
  return (
    <main className="bg-obsidian">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <SignatureDishes />
      <BestSellers />
      <RoyalExperience />
      <ChefSpecial />
      <Testimonials />
      <Gallery />
      <ReservationCTA />
      <Footer />
    </main>
  );
}
