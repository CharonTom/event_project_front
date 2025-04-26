const Account = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow rounded-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mon Compte</h2>
        <div className="space-y-2 mb-6">
          <p className="text-gray-600">
            <strong>Nom :</strong> Jean Dupont
          </p>
          <p className="text-gray-600">
            <strong>Email :</strong> jean.dupont@example.com
          </p>
        </div>
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => alert("Page Account test 🎉")}
        >
          Tester Account
        </button>
      </div>
    </div>
  );
};

export default Account;
