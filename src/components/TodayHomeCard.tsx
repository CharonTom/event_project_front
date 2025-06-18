import TodayBanner from "../assets/today-banner.png";
// import { TbChevronLeft } from "react-icons/tb";
// import { TbChevronRight } from "react-icons/tb";

function TodayHomeCard() {
  return (
    <div className="py-4">
      <p className="my-4">Evénement sponsorisé</p>
      <div className="relative">
        {/* <div className="absolute -left-5 top-[40%] text-7xl text-primary">
          <TbChevronLeft />
        </div> */}
        <img
          className="rounded-2xl h-124 object-cover mx-auto"
          src={TodayBanner}
          alt=""
        />
        {/* <div className="absolute -right-5 top-[40%] text-7xl text-primary">
          <TbChevronRight />
        </div> */}
      </div>
      <h1 className="my-4 font-bold font-roboto">
        Hard Queens : Shockwave <br /> (Fête De La Musique)
      </h1>
    </div>
  );
}

export default TodayHomeCard;
