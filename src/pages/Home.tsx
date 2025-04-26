const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Bienvenue !</h1>
      <p className="text-lg text-gray-600 mb-6">
        Ceci est ta page d’accueil de test.
      </p>
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        onClick={() => alert("Test OK 🎉")}
      >
        Tester
      </button>
    </div>
  );
};

export default Home;
