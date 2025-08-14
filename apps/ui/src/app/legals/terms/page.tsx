import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - RentToCraft",
  description:
    "Conditions générales d'utilisation de la plateforme RentToCraft",
};

const TermsPage = () => {
  return (
    <div className="layout-maxed py-40">
      <h1>Conditions Générales d'Utilisation</h1>

      <section className="mt-40">
        <h2>1. Préambule</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent
          l'utilisation de la plateforme RentToCraft, service de location
          d'outils entre particuliers accessible à l'adresse
          www.renttocraft.com.
        </p>
        <p>
          En utilisant notre plateforme, vous acceptez sans réserve les
          présentes conditions. Si vous n'acceptez pas ces conditions, veuillez
          ne pas utiliser notre service.
        </p>
      </section>

      <section className="mt-40">
        <h2>2. Définitions</h2>
        <ul>
          <li>
            <strong>Plateforme</strong> : Le site web RentToCraft et ses
            services associés
          </li>
          <li>
            <strong>Utilisateur</strong> : Toute personne utilisant la
            plateforme
          </li>
          <li>
            <strong>Loueur</strong> : Utilisateur qui met en location un objet
          </li>
          <li>
            <strong>Locataire</strong> : Utilisateur qui loue un objet
          </li>
          <li>
            <strong>Objet</strong> : Tout outil, équipement ou matériel mis en
            location
          </li>
          <li>
            <strong>Location</strong> : Transaction entre un loueur et un
            locataire
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>3. Description du service</h2>
        <p>
          RentToCraft est une plateforme de mise en relation permettant aux
          utilisateurs de :
        </p>
        <ul>
          <li>Mettre en location des outils et équipements</li>
          <li>Louer des outils et équipements auprès d'autres utilisateurs</li>
          <li>Échanger des messages et évaluations</li>
          <li>Gérer leurs transactions de location</li>
        </ul>
        <p>
          RentToCraft agit uniquement comme intermédiaire et n'est pas partie
          aux transactions entre utilisateurs.
        </p>
      </section>

      <section className="mt-40">
        <h2>4. Inscription et compte utilisateur</h2>

        <h3>4.1 Conditions d'inscription</h3>
        <ul>
          <li>Être majeur et capable juridiquement</li>
          <li>Fournir des informations exactes et à jour</li>
          <li>Ne pas créer plusieurs comptes pour une même personne</li>
          <li>Protéger ses identifiants de connexion</li>
        </ul>

        <h3>4.2 Responsabilité du compte</h3>
        <p>
          Vous êtes responsable de toutes les activités effectuées depuis votre
          compte. Vous devez immédiatement nous informer de toute utilisation
          non autorisée.
        </p>
      </section>

      <section className="mt-40">
        <h2>5. Obligations des utilisateurs</h2>

        <h3>5.1 Obligations générales</h3>
        <ul>
          <li>Respecter les lois et réglementations en vigueur</li>
          <li>Ne pas utiliser la plateforme à des fins illégales</li>
          <li>Ne pas porter atteinte aux droits d'autrui</li>
          <li>Ne pas perturber le fonctionnement de la plateforme</li>
        </ul>

        <h3>5.2 Obligations spécifiques aux loueurs</h3>
        <ul>
          <li>Décrire fidèlement les objets mis en location</li>
          <li>Fournir des photos de qualité des objets</li>
          <li>Maintenir les objets en bon état</li>
          <li>Respecter les engagements pris envers les locataires</li>
          <li>Assurer la disponibilité des objets aux dates convenues</li>
        </ul>

        <h3>5.3 Obligations spécifiques aux locataires</h3>
        <ul>
          <li>Utiliser les objets conformément à leur destination</li>
          <li>Respecter les conditions de location</li>
          <li>Restituer les objets dans l'état où ils ont été reçus</li>
          <li>Signaler tout dommage ou problème</li>
          <li>Payer les frais de location dans les délais convenus</li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>6. Interdictions</h2>
        <p>Il est interdit de :</p>
        <ul>
          <li>Mettre en location des objets illégaux ou dangereux</li>
          <li>
            Utiliser la plateforme pour des activités commerciales non
            autorisées
          </li>
          <li>Publier du contenu diffamatoire, injurieux ou offensant</li>
          <li>Tenter de contourner les systèmes de sécurité</li>
          <li>Collecter des données personnelles d'autres utilisateurs</li>
          <li>Utiliser des robots ou scripts automatisés</li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>7. Propriété intellectuelle</h2>
        <p>
          La plateforme RentToCraft et son contenu (textes, images, logos,
          logiciels) sont protégés par le droit d'auteur. Toute reproduction ou
          utilisation non autorisée est interdite.
        </p>
        <p>
          Les utilisateurs conservent leurs droits sur le contenu qu'ils
          publient, mais accordent à RentToCraft une licence d'utilisation pour
          les besoins du service.
        </p>
      </section>

      <section className="mt-40">
        <h2>8. Responsabilité</h2>

        <h3>8.1 Limitation de responsabilité de RentToCraft</h3>
        <p>
          RentToCraft s'efforce de maintenir la plateforme accessible et
          fonctionnelle, mais ne peut garantir une disponibilité continue. Nous
          ne sommes pas responsables :
        </p>
        <ul>
          <li>Des transactions entre utilisateurs</li>
          <li>De la qualité ou conformité des objets loués</li>
          <li>Des dommages causés par l'utilisation des objets</li>
          <li>Des litiges entre utilisateurs</li>
        </ul>

        <h3>8.2 Responsabilité des utilisateurs</h3>
        <p>
          Les utilisateurs sont responsables de leurs actes et des conséquences
          de l'utilisation de la plateforme.
        </p>
      </section>

      <section className="mt-40">
        <h2>9. Protection des données</h2>
        <p>
          Le traitement de vos données personnelles est régi par notre
          <a href="/legals/privacy" className="text-primary hover:underline">
            {" "}
            Politique de confidentialité
          </a>
          .
        </p>
      </section>

      <section className="mt-40">
        <h2>10. Modération et sanctions</h2>
        <p>RentToCraft se réserve le droit de :</p>
        <ul>
          <li>Modérer le contenu publié sur la plateforme</li>
          <li>Suspendre ou supprimer un compte utilisateur</li>
          <li>Refuser l'accès au service</li>
          <li>Porter plainte en cas d'infraction</li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>11. Modification des CGU</h2>
        <p>
          RentToCraft peut modifier ces conditions à tout moment. Les
          utilisateurs seront informés des changements significatifs par email
          ou via la plateforme.
        </p>
      </section>

      <section className="mt-40">
        <h2>12. Droit applicable et juridiction</h2>
        <p>
          Les présentes CGU sont soumises au droit français. En cas de litige,
          les tribunaux français sont seuls compétents.
        </p>
      </section>

      <section className="mt-40">
        <h2>13. Contact</h2>
        <p>
          Pour toute question concernant ces conditions :<br />
          <strong>Email</strong> : legal@renttocraft.com
          <br />
          <strong>Adresse</strong> : 123 Avenue de la République, 75001 Paris,
          France
        </p>
      </section>

      <div className="mt-40 text-sm text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  );
};

export default TermsPage;
