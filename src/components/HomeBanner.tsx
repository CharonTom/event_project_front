import singer from "../assets/singer-girl.png";
import { useNavigate } from "react-router-dom";

function HomeBanner() {
  const navigate = useNavigate();

  return (
    <div
      className="my-8 pl-4 pt-6 relative w-full overflow-hidden 
                    bg-linear-to-t from-[#845def] from-2% to-[#56d2d2] 
                    rounded-3xl h-64 text-white"
    >
      <img
        className="absolute right-0 bottom-0 w-1/2 md:w-1/4 lg:w-[15%] 
                   z-0"
        src={singer}
        alt="a singing girl"
      />

      <div className="relative z-10">
        <p className="mb-6 font-semibold">Organisez-vous des événements ?</p>
        <p className="mb-6">Faisons bouger le monde ensemble</p>
        <p className="mb-6">Créer • Promouvoir • Vendre</p>
        <button
          onClick={() => navigate("/events/create")}
          className="btn-primary py-3"
        >
          Créer un événement
        </button>
      </div>
    </div>
  );
}

export default HomeBanner;
