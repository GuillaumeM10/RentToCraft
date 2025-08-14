import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - RentToCraft",
  description:
    "Politique de protection des données personnelles de RentToCraft",
};

const PrivacyPage = () => {
  return (
    <div className="layout-maxed py-40">
      <h1>Politique de confidentialité</h1>

      <section className="mt-40">
        <h2>1. Introduction</h2>
        <p>
          RentToCraft s'engage à protéger la vie privée de ses utilisateurs et à
          traiter leurs données personnelles dans le respect du Règlement
          Général sur la Protection des Données (RGPD) et de la loi Informatique
          et Libertés.
        </p>
        <p>
          Cette politique de confidentialité décrit comment nous collectons,
          utilisons et protégeons vos données personnelles lorsque vous utilisez
          notre plateforme de location d'outils entre particuliers.
        </p>
      </section>

      <section className="mt-40">
        <h2>2. Responsable du traitement</h2>
        <p>
          <strong>RentToCraft</strong>
          <br />
          123 Avenue de la République
          <br />
          75001 Paris, France
          <br />
          Email : privacy@renttocraft.com
          <br />
          Téléphone : +33 1 42 86 95 30
        </p>
      </section>

      <section className="mt-40">
        <h2>3. Données collectées</h2>
        <h3>3.1 Données d'identification</h3>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Adresse postale</li>
          <li>Ville de résidence</li>
        </ul>

        <h3>3.2 Données de connexion</h3>
        <ul>
          <li>Adresse IP</li>
          <li>Données de navigation (cookies, logs)</li>
          <li>Historique des connexions</li>
        </ul>

        <h3>3.3 Données d'utilisation</h3>
        <ul>
          <li>Objets loués et locations effectuées</li>
          <li>Commentaires et évaluations</li>
          <li>Messages échangés entre utilisateurs</li>
          <li>Préférences et paramètres</li>
        </ul>

        <h3>3.4 Données de paiement</h3>
        <ul>
          <li>Informations de facturation</li>
          <li>Historique des transactions</li>
          <li>
            Données de paiement (traitées par nos prestataires de paiement)
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>4. Finalités du traitement</h2>
        <p>Vos données sont collectées pour les finalités suivantes :</p>
        <ul>
          <li>
            <strong>Création et gestion de compte utilisateur</strong> : Base
            légale - Exécution du contrat
          </li>
          <li>
            <strong>Mise en relation entre loueurs et locataires</strong> : Base
            légale - Exécution du contrat
          </li>
          <li>
            <strong>Gestion des locations et paiements</strong> : Base légale -
            Exécution du contrat
          </li>
          <li>
            <strong>Support client et assistance</strong> : Base légale -
            Intérêt légitime
          </li>
          <li>
            <strong>Amélioration du service</strong> : Base légale - Intérêt
            légitime
          </li>
          <li>
            <strong>Communication marketing</strong> : Base légale -
            Consentement
          </li>
          <li>
            <strong>Respect des obligations légales</strong> : Base légale -
            Obligation légale
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>5. Destinataires des données</h2>
        <p>Vos données peuvent être partagées avec :</p>
        <ul>
          <li>
            <strong>Autres utilisateurs</strong> : Nom, prénom, ville (pour les
            profils publics)
          </li>
          <li>
            <strong>Prestataires de paiement</strong> : Données nécessaires au
            traitement des paiements
          </li>
          <li>
            <strong>Prestataires techniques</strong> : Hébergement, maintenance,
            support
          </li>
          <li>
            <strong>Autorités compétentes</strong> : Sur demande légale
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>6. Durée de conservation</h2>
        <ul>
          <li>
            <strong>Données de compte</strong> : 3 ans après la dernière
            activité
          </li>
          <li>
            <strong>Données de transaction</strong> : 10 ans (obligation
            comptable)
          </li>
          <li>
            <strong>Données de connexion</strong> : 12 mois
          </li>
          <li>
            <strong>Cookies</strong> : Selon la durée définie dans notre
            politique cookies
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>7. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>
            <strong>Droit d'accès</strong> : Connaître les données vous
            concernant
          </li>
          <li>
            <strong>Droit de rectification</strong> : Corriger des données
            inexactes
          </li>
          <li>
            <strong>Droit à l'effacement</strong> : Supprimer vos données
          </li>
          <li>
            <strong>Droit à la limitation</strong> : Limiter le traitement
          </li>
          <li>
            <strong>Droit à la portabilité</strong> : Récupérer vos données
          </li>
          <li>
            <strong>Droit d'opposition</strong> : S'opposer au traitement
          </li>
          <li>
            <strong>Droit de retrait du consentement</strong> : Retirer votre
            consentement
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>8. Exercice de vos droits</h2>
        <p>
          Pour exercer vos droits, vous pouvez nous contacter :<br />
          <strong>Email</strong> : privacy@renttocraft.com
          <br />
          <strong>Adresse postale</strong> : 123 Avenue de la République, 75001
          Paris, France
          <br />
          <strong>Formulaire en ligne</strong> : https://renttocraft.com/contact
        </p>
        <p>
          Nous nous engageons à répondre dans un délai maximum de 30 jours. En
          cas de refus, nous vous expliquerons les motifs de notre décision.
        </p>
      </section>

      <section className="mt-40">
        <h2>9. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          appropriées pour protéger vos données :
        </p>
        <ul>
          <li>Chiffrement des données sensibles</li>
          <li>Accès restreint aux données personnelles</li>
          <li>Surveillance et audit réguliers</li>
          <li>Sauvegarde sécurisée</li>
          <li>Formation du personnel</li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>10. Cookies et traceurs</h2>
        <p>
          Notre site utilise des cookies et traceurs. Pour plus d'informations,
          consultez notre{" "}
          <a href="/legals/cookies" className="text-primary hover:underline">
            politique de gestion des cookies
          </a>
          .
        </p>
      </section>

      <section className="mt-40">
        <h2>11. Transferts hors UE</h2>
        <p>
          Vos données sont principalement traitées en France et dans l'Union
          Européenne. En cas de transfert hors UE, nous nous assurons que des
          garanties appropriées sont en place (clauses contractuelles types,
          décisions d'adéquation, etc.).
        </p>
      </section>

      <section className="mt-40">
        <h2>12. Réclamation</h2>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          déposer une réclamation auprès de la CNIL :<br />
          <a
            href="https://www.cnil.fr"
            className="text-primary hover:underline"
          >
            www.cnil.fr
          </a>
        </p>
      </section>

      <section className="mt-40">
        <h2>13. Contact</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité :
          <br />
          <strong>Email</strong> : privacy@renttocraft.com
          <br />
          <strong>Téléphone</strong> : +33 1 42 86 95 30
        </p>
      </section>

      <div className="mt-40 text-sm text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
