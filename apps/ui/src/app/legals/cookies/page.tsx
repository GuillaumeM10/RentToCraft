import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des cookies - RentToCraft",
  description: "Politique de gestion des cookies et traceurs de RentToCraft",
};

const CookiesPage = () => {
  return (
    <div className="layout-maxed py-40">
      <h1>Gestion des cookies et traceurs</h1>

      <section className="mt-40">
        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal
          (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il
          permet de stocker des informations relatives à votre navigation et
          peut être lu lors de vos visites ultérieures.
        </p>
      </section>

      <section className="mt-40">
        <h2>2. Types de cookies utilisés</h2>

        <h3>2.1 Cookies strictement nécessaires</h3>
        <p>
          Ces cookies sont indispensables au fonctionnement du site et ne
          peuvent pas être désactivés.
        </p>
        <ul>
          <li>
            <strong>Session utilisateur</strong> : Maintien de votre connexion
          </li>
          <li>
            <strong>Sécurité</strong> : Protection contre les attaques
          </li>
          <li>
            <strong>Préférences techniques</strong> : Langue, résolution d'écran
          </li>
        </ul>

        <h3>2.2 Cookies de performance et statistiques</h3>
        <p>
          Ces cookies nous permettent de mesurer l'audience et d'analyser le
          comportement des utilisateurs pour améliorer notre service.
        </p>
        <ul>
          <li>
            <strong>Google Analytics</strong> : Mesure d'audience et
            statistiques de navigation
          </li>
          <li>
            <strong>Hotjar</strong> : Analyse du comportement utilisateur (si
            utilisé)
          </li>
        </ul>

        <h3>2.3 Cookies de fonctionnalité</h3>
        <p>
          Ces cookies permettent d'améliorer votre expérience utilisateur en
          mémorisant vos préférences.
        </p>
        <ul>
          <li>
            <strong>Préférences de recherche</strong> : Filtres, tri,
            localisation
          </li>
          <li>
            <strong>Personnalisation</strong> : Interface adaptée à vos besoins
          </li>
        </ul>

        <h3>2.4 Cookies de ciblage et publicité</h3>
        <p>
          Ces cookies sont utilisés pour vous proposer des contenus et
          publicités adaptés à vos centres d'intérêt.
        </p>
        <ul>
          <li>
            <strong>Réseaux sociaux</strong> : Partage de contenu
          </li>
          <li>
            <strong>Publicité ciblée</strong> : Publicités personnalisées (si
            applicable)
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>3. Durée de conservation</h2>
        <ul>
          <li>
            <strong>Cookies de session</strong> : Supprimés à la fermeture du
            navigateur
          </li>
          <li>
            <strong>Cookies persistants</strong> : 13 mois maximum
          </li>
          <li>
            <strong>Cookies tiers</strong> : Selon la politique du tiers
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>4. Gestion de vos préférences</h2>

        <h3>4.1 Via notre interface</h3>
        <p>
          Vous pouvez à tout moment modifier vos préférences en utilisant notre
          panneau de gestion des cookies accessible depuis le bandeau
          d'information en bas de page.
        </p>

        <h3>4.2 Via votre navigateur</h3>
        <p>
          Vous pouvez également configurer votre navigateur pour refuser les
          cookies :
        </p>
        <ul>
          <li>
            <strong>Chrome</strong> : Paramètres → Confidentialité et sécurité →
            Cookies et autres données de sites
          </li>
          <li>
            <strong>Firefox</strong> : Options → Vie privée et sécurité →
            Cookies et données de sites
          </li>
          <li>
            <strong>Safari</strong> : Préférences → Confidentialité → Cookies et
            données de sites web
          </li>
          <li>
            <strong>Edge</strong> : Paramètres → Cookies et autorisations de
            sites
          </li>
        </ul>

        <h3>4.3 Via les plateformes de gestion</h3>
        <p>
          Pour les cookies tiers, vous pouvez vous opposer via les plateformes
          suivantes :
        </p>
        <ul>
          <li>
            <strong>Google Analytics</strong> :{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-primary hover:underline"
            >
              https://tools.google.com/dlpage/gaoptout
            </a>
          </li>
          <li>
            <strong>YourOnlineChoices</strong> :{" "}
            <a
              href="https://www.youronlinechoices.com"
              className="text-primary hover:underline"
            >
              https://www.youronlinechoices.com
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>5. Impact du refus des cookies</h2>
        <p>
          Le refus de certains cookies peut impacter le fonctionnement du site :
        </p>
        <ul>
          <li>
            <strong>Cookies strictement nécessaires</strong> : Le site ne peut
            pas fonctionner sans ces cookies
          </li>
          <li>
            <strong>Cookies de performance</strong> : Nous ne pourrons pas
            améliorer le service
          </li>
          <li>
            <strong>Cookies de fonctionnalité</strong> : Certaines
            fonctionnalités pourraient être limitées
          </li>
          <li>
            <strong>Cookies de ciblage</strong> : Les publicités ne seront pas
            personnalisées
          </li>
        </ul>
      </section>

      <section className="mt-40">
        <h2>6. Cookies tiers détaillés</h2>

        <h3>6.1 Google Analytics</h3>
        <p>
          <strong>Finalité</strong> : Mesure d'audience et analyse du
          comportement des utilisateurs
          <br />
          <strong>Durée</strong> : 2 ans (_ga), 24 heures (_gid), 1 minute
          (_gat)
          <br />
          <strong>Politique</strong> :{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-primary hover:underline"
          >
            https://policies.google.com/privacy
          </a>
        </p>

        <h3>6.2 Réseaux sociaux</h3>
        <p>
          <strong>Facebook</strong> : Partage de contenu et publicité ciblée
          <br />
          <strong>Twitter/X</strong> : Partage de contenu
          <br />
          <strong>LinkedIn</strong> : Partage de contenu professionnel
        </p>
      </section>

      <section className="mt-40">
        <h2>7. Mise à jour de cette politique</h2>
        <p>
          Cette politique peut être mise à jour pour refléter les évolutions de
          notre site ou de la réglementation. Nous vous informerons de tout
          changement significatif.
        </p>
      </section>

      <section className="mt-40">
        <h2>8. Contact</h2>
        <p>
          Pour toute question concernant notre politique de gestion des cookies
          :<br />
          <strong>Email</strong> : privacy@renttocraft.com
          <br />
          <strong>Téléphone</strong> : +33 1 42 86 95 30
        </p>
      </section>

      <div className="mt-40 p-20 bg-gray-100 rounded-lg">
        <h3>Panneau de gestion des cookies</h3>
        <p>
          Utilisez les boutons ci-dessous pour gérer vos préférences de cookies
          :
        </p>
        <div className="mt-20 space-y-10">
          <button className="btn btn-primary mr-10">
            Accepter tous les cookies
          </button>
          <button className="btn btn-outline mr-10">
            Refuser les cookies non essentiels
          </button>
          <button className="btn btn-outline">Personnaliser mes choix</button>
        </div>
      </div>

      <div className="mt-40 text-sm text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>
    </div>
  );
};

export default CookiesPage;
