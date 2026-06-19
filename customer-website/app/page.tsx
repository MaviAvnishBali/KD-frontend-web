import { HeroSection } from "./components/layout/HeroSection";
import { FeaturedCategories } from "./components/menu/FeaturedCategories";
import { BestSellers } from "./components/menu/BestSellers";
import { WhyChooseUs } from "./components/layout/WhyChooseUs";
import { SpecialOffers } from "./components/layout/SpecialOffers";
import { Testimonials } from "./components/layout/Testimonials";
import { ReservationCTA } from "./components/layout/ReservationCTA";
import { AppDownloadBanner } from "./components/layout/AppDownloadBanner";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCategories />
      <BestSellers />
      <SpecialOffers />
      <WhyChooseUs />
      <ReservationCTA />
      <Testimonials />
      <AppDownloadBanner />
    </main>
  );
}
