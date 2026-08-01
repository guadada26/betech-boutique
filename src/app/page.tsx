import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Drop from '@/components/Drop';
import Brands from '@/components/Brands';
import Team from '@/components/Team';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+4.25rem)] md:pb-0 md:pt-0">
        <Hero />
        <Categories />
        <Drop />
        <Brands />
        <Team />
        <Benefits />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
