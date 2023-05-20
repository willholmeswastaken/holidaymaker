import { type NextPage } from "next";
import HeroHome from "@/components/hero-home";
import Seo from "@/components/seo";

const Home: NextPage = () => {
  return (
    <>
      <Seo
        title="HolidayMaker - Home"
        description="Holidays are meant to be enjoyed. We help you capture the moments that matter."
        image="https://holidaymaker.vercel.app/api/og?title=HolidayMaker - Home"
      />
      <HeroHome />
    </>
  );
};

export default Home;
