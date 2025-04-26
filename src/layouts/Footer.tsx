const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
      © {currentYear} - Tous droits réservés.
    </footer>
  );
};

export default Footer;
