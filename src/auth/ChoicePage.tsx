import logo from "../assets/logo-evently.png";
import { useNavigate } from "react-router-dom";

function ChoicePage() {
  const navigate = useNavigate();
  return (
    <section className="fixed inset-0 flex flex-center bg-linear-to-b from-[#845def] from-40% to-[#56d2d2]">
      <div className="flex flex-col flex-center gap-24 max-h-full max-w-full overflow-hidden">
        <img src={logo} alt="logo de l'appli" className="w-64 h-auto" />
        <div className="flex flex-col flex-center gap-4 w-full">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-secondary text-white rounded w-[80%]"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-primary hover:bg-gray-300 text-white rounded w-[80%]"
          >
            Sign up
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChoicePage;
