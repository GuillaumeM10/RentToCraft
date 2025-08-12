import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer layout-maxed bg-primary text-white tac py-24 mt-70">
      <nav className="flex flex-wrap justify-center gap-16 my-24">
        <Link href="/" className="btn btn-underline-white">
          Accueil
        </Link>

        <Link href="/rental" className="btn btn-underline-white">
          Objets
        </Link>

        <Link href="/about" className="btn btn-underline-white">
          À propos
        </Link>

        <Link href="/contact" className="btn btn-underline-white">
          Contact
        </Link>
      </nav>
      <div className="footer-content">
        <p>
          © {new Date().getUTCFullYear()} RentToCraft. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
