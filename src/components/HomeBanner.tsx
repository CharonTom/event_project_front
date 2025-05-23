import singer from "../assets/singer-girl.png";

function HomeBanner() {
  return (
    <div className="my-8 pl-4 pt-6 relative w-full bg-linear-to-t from-[#845def] from-2% to-[#56d2d2] rounded-3xl h-64 text-white">
      <img
        className="absolute right-0 bottom-0 w-1/2"
        src={singer}
        alt="a singing girl"
      />
      <p className="mb-6 font-semibold">Organisez-vous des événements ?</p>
      <p className="mb-6">Faisons bouger le monde ensemble</p>
      <p className="mb-6">Créer • Promouvoir • Vendre</p>
      <button className="btn-gradient">Créer un évenement</button>
    </div>
  );
}

export default HomeBanner;
