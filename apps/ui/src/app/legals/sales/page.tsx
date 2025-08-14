import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente - RentToCraft",
  description: "Conditions générales de vente et de location de RentToCraft",
};

const SalesPage = () => {
  return (
    <div className="layout-maxed py-40">
      <h1>Conditions Générales de Vente</h1>

      <section className="mt-40">
        <h2>1. Préambule</h2>
        <p>
          Les présentes Conditions Générales de Vente (CGV) s'appliquent à tous
          les services proposés par RentToCraft sur sa plateforme de location
          d'outils entre particuliers.
        </p>
        <p>
          RentToCraft agit comme intermédiaire entre les loueurs et les
          locataires. Ces conditions s'appliquent aux services de mise en
          relation et aux frais de commission.
        </p>
      </section>

      <section className="mt-40">
        <h2>2. Définitions</h2>
        <ul>
          <li>
            <strong>RentToCraft</strong> : La société éditrice de la plateforme
          </li>
          <li>
            <strong>Loueur</strong> : Particulier qui met en location un objet
          </li>
          <li>
            <strong>Locataire</strong> : Particulier qui loue un objet
          </li>
          <li>
            <strong>Location</strong> : Contrat de location entre un loueur et
            un locataire
          </li>
          <li>
            <strong>Commission</strong> : Frais prélevés par RentToCraft sur
            chaque transaction
          </li>
          <li>
            <strong>Prix de location</strong> : Montant fixé par le loueur pour
            la location de son objet
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>3. Services proposés</h2>
        <p>RentToCraft propose les services suivants :</p>
        <ul>
          <li>Mise en relation entre loueurs et locataires</li>
          <li>Gestion des réservations et paiements</li>
          <li>Support client et assistance</li>
          <li>Service de garantie et protection (si applicable)</li>
          <li>Outils de communication entre utilisateurs</li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>4. Tarifs et commissions</h2>

        <h3>4.1 Commission RentToCraft</h3>
        <p>
          RentToCraft prélève une commission de 15% sur chaque transaction de
          location. Cette commission est calculée sur le montant total de la
          location (prix de location + frais éventuels).
        </p>

        <h3>4.2 Prix de location</h3>
        <p>
          Les prix de location sont fixés librement par les loueurs. Ils doivent
          être exprimés en euros et inclure toutes les taxes applicables.
        </p>

        <h3>4.3 Frais supplémentaires</h3>
        <ul>
          <li>
            <strong>Frais de service</strong> : 2€ par transaction
          </li>
          <li>
            <strong>Frais de garantie</strong> : 5€ (optionnel)
          </li>
          <li>
            <strong>Frais de retard</strong> : 10€ par jour de retard
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>5. Processus de location</h2>

        <h3>5.1 Réservation</h3>
        <ol>
          <li>Le locataire sélectionne un objet et une période de location</li>
          <li>Il valide sa réservation en payant le montant total</li>
          <li>Le loueur reçoit une notification de demande de location</li>
          <li>Le loueur accepte ou refuse la demande sous 24h</li>
        </ol>

        <h3>5.2 Paiement</h3>
        <p>
          Le paiement est sécurisé et effectué en ligne. RentToCraft conserve le
          montant jusqu'à la fin de la location.
        </p>

        <h3>5.3 Remise de l'objet</h3>
        <p>
          La remise de l'objet se fait directement entre le loueur et le
          locataire, selon les modalités convenues entre eux.
        </p>
      </section>

      <section className="mt-40">
        <h2>6. Obligations des parties</h2>

        <h3>6.1 Obligations de RentToCraft</h3>
        <ul>
          <li>Mettre en place et maintenir la plateforme</li>
          <li>Assurer la sécurité des paiements</li>
          <li>Fournir un support client</li>
          <li>Respecter la confidentialité des données</li>
        </ul>

        <h3>6.2 Obligations du loueur</h3>
        <ul>
          <li>Décrire fidèlement l'objet mis en location</li>
          <li>Maintenir l'objet en bon état</li>
          <li>Respecter les engagements pris</li>
          <li>Répondre aux demandes de location dans les délais</li>
        </ul>

        <h3>6.3 Obligations du locataire</h3>
        <ul>
          <li>Payer le montant convenu</li>
          <li>Utiliser l'objet conformément à sa destination</li>
          <li>Restituer l'objet dans l'état initial</li>
          <li>Signaler tout dommage</li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>7. Garanties et responsabilités</h2>

        <h3>7.1 Garantie de RentToCraft</h3>
        <p>
          RentToCraft s'engage à fournir un service de qualité mais ne peut
          garantir :
        </p>
        <ul>
          <li>La disponibilité continue de la plateforme</li>
          <li>La qualité des objets loués</li>
          <li>Le comportement des utilisateurs</li>
        </ul>

        <h3>7.2 Limitation de responsabilité</h3>
        <p>
          La responsabilité de RentToCraft est limitée au montant des
          commissions perçues sur la transaction litigieuse.
        </p>
      </section>

      <section className="mt-40">
        <h2>8. Annulation et remboursement</h2>

        <h3>8.1 Annulation par le locataire</h3>
        <ul>
          <li>
            <strong>Plus de 48h avant</strong> : Remboursement intégral
          </li>
          <li>
            <strong>Entre 24h et 48h avant</strong> : Remboursement de 50%
          </li>
          <li>
            <strong>Moins de 24h avant</strong> : Pas de remboursement
          </li>
        </ul>

        <h3>8.2 Annulation par le loueur</h3>
        <ul>
          <li>
            <strong>Plus de 24h avant</strong> : Remboursement intégral
          </li>
          <li>
            <strong>Moins de 24h avant</strong> : Remboursement + indemnisation
          </li>
        </ul>

        <h3>8.3 Force majeure</h3>
        <p>
          En cas de force majeure, le remboursement intégral est effectué sans
          frais supplémentaires.
        </p>
      </section>

      <section className="mt-40">
        <h2>9. Litiges et médiation</h2>
        <p>
          En cas de litige, les parties s'efforcent de trouver une solution
          amiable. Si aucun accord n'est trouvé, le litige peut être soumis à la
          médiation.
        </p>
        <p>
          <strong>Médiateur</strong> : Fédération du e-commerce et de la vente à
          distance (FEVAD)
          <br />
          <strong>Adresse</strong> : 60 rue de la Chaussée d'Antin, 75009 Paris
          <br />
          <strong>Site web</strong> : https://www.mediateurfevad.fr
        </p>
      </section>

      <section className="mt-40">
        <h2>10. Protection des données</h2>
        <p>
          Le traitement des données personnelles est régi par notre
          <a href="/legals/privacy" className="text-primary hover:underline">
            {" "}
            Politique de confidentialité
          </a>
          .
        </p>
      </section>

      <section className="mt-40">
        <h2>11. Droit applicable et juridiction</h2>
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige,
          les tribunaux français sont seuls compétents.
        </p>
      </section>

      <section className="mt-40">
        <h2>12. Contact</h2>
        <p>
          <strong>RentToCraft</strong>
          <br />
          123 Avenue de la République
          <br />
          75001 Paris, France
          <br />
          <strong>Email</strong> : contact@renttocraft.com
          <br />
          <strong>Téléphone</strong> : +33 1 42 86 95 30
          <br />
          <strong>SIRET</strong> : 12345678901234
        </p>
      </section>

      <div className="mt-40 text-sm text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  );
};

export default SalesPage;
