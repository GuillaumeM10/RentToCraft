import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="footer layout-maxed bg-primary text-white tac py-24 mt-70"
      role="contentinfo"
    >
      <nav
        className="flex flex-wrap justify-center gap-16 my-24"
        aria-label="Liens de pied de page"
      >
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

      <nav
        className="flex flex-wrap justify-center gap-16 my-24"
        aria-label="Liens légaux"
      >
        <Link
          href="/legals"
          className="btn btn-underline-white opacity-80 btn-small"
        >
          Mentions légales
        </Link>

        <Link
          href="/legals/privacy"
          className="btn btn-underline-white opacity-80 btn-small"
        >
          Confidentialité
        </Link>

        <Link
          href="/legals/cookies"
          className="btn btn-underline-white opacity-80 btn-small"
        >
          Cookies
        </Link>

        <Link
          href="/legals/terms"
          className="btn btn-underline-white opacity-80 btn-small"
        >
          CGU
        </Link>

        <Link
          href="/legals/sales"
          className="btn btn-underline-white opacity-80 btn-small"
        >
          CGV
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
