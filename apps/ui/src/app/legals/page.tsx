import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales - RentToCraft",
  description: "Mentions légales et informations légales de RentToCraft",
};

const LegalsPage = () => {
  return (
    <div className="layout-maxed py-40">
      <h1>Mentions légales</h1>

      <section className="mt-40">
        <h2>Éditeur du site</h2>
        <p>
          <strong>RentToCraft</strong>
          <br />
          123 Avenue de la République
          <br />
          75001 Paris, France
          <br />
          Téléphone : +33 1 42 86 95 30
          <br />
          Email : contact@renttocraft.com
          <br />
          SIRET : 12345678901234
          <br />
          RCS : Paris B 123 456 789
        </p>
      </section>

      <section className="mt-40">
        <h2>Directeur de la publication</h2>
        <p>
          Le directeur de la publication est Jean Dupont, en qualité de
          Président Directeur Général.
        </p>
      </section>

      <section className="mt-40">
        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par :<br />
          OVH SAS
          <br />
          2 rue Kellermann
          <br />
          59100 Roubaix, France
          <br />
          Téléphone : +33 9 72 10 10 07
        </p>
      </section>

      <section className="mt-40">
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble de ce site relève de la législation française et
          internationale sur le droit d'auteur et la propriété intellectuelle.
          Tous les droits de reproduction sont réservés, y compris pour les
          documents téléchargeables et les représentations iconographiques et
          photographiques.
        </p>
        <p>
          La reproduction de tout ou partie de ce site sur un support
          électronique quel qu'il soit est formellement interdite sauf
          autorisation expresse du directeur de la publication.
        </p>
      </section>

      <section className="mt-40">
        <h2>Responsabilité</h2>
        <p>
          Les informations contenues sur ce site sont aussi précises que
          possible et le site est périodiquement remis à jour, mais peut
          toutefois contenir des inexactitudes, des omissions ou des lacunes.
        </p>
        <p>
          Si vous constatez une lacune, erreur ou ce qui parait être un
          dysfonctionnement, merci de bien vouloir le signaler par email à
          l'adresse contact@renttocraft.com, en décrivant le problème de la
          manière la plus précise possible.
        </p>
      </section>

      <section className="mt-40">
        <h2>Liens hypertextes</h2>
        <p>
          Les liens hypertextes mis en place dans le cadre du présent site web
          en direction d'autres ressources présentes sur le réseau Internet ne
          sauraient engager la responsabilité de RentToCraft.
        </p>
      </section>

      <section className="mt-40">
        <h2>Cookies</h2>
        <p>
          Le site peut-être amené à vous demander l'acceptation des cookies pour
          des besoins de statistiques et d'affichage. Un cookie ne nous permet
          pas de vous identifier ; il sert uniquement à enregistrer des
          informations relatives à la navigation de votre ordinateur sur notre
          site.
        </p>
        <p>
          Vous pouvez à tout moment désactiver ces cookies et être libre de
          refuser leur dépôt sur votre terminal en vous rendant sur notre page
          de gestion des cookies.
        </p>
      </section>

      <section className="mt-40">
        <h2>Droit applicable</h2>
        <p>
          Tout litige en relation avec l'utilisation du site RentToCraft est
          soumis au droit français. En dehors des cas où la loi ne le permet
          pas, il est fait attribution exclusive de juridiction aux tribunaux
          compétents de Paris.
        </p>
      </section>

      <section className="mt-40">
        <h2>Contact</h2>
        <p>
          Pour toute question concernant ces mentions légales, vous pouvez nous
          contacter à l'adresse suivante : contact@renttocraft.com
        </p>
      </section>

      <div className="mt-40 text-sm text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  );
};

export default LegalsPage;
