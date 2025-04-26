// src/pages/Details.tsx
import { useNavigate } from "react-router-dom";

const Details = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Détails de l’élément
        </h2>
        <p className="text-gray-600 mb-2">
          <strong>ID :</strong> 12345
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Nom :</strong> Exemple d’élément
        </p>
        <p className="text-gray-600 mb-6">
          <strong>Description :</strong> Ceci est une description de test pour
          ta page de détails. Tu peux la remplacer par ce dont tu as besoin.
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mr-2"
          onClick={() => alert("Action de test")}
        >
          Action
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          onClick={() => navigate(-1)}
        >
          Revenir
        </button>
      </div>
    </div>
  );
};

export default Details;
