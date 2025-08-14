import Accordion from "../components/Sections/Accordion";
import Landing from "../components/Sections/Landing";
import Numbers from "../components/Sections/Numbers";
import Split from "../components/Sections/Split";

const aboutFaq = [
  {
    title: "Qui sommes-nous ?",
    content:
      "RentToCraft est une plateforme collaborative dédiée à la location et au partage d’outils entre particuliers. Notre mission est de faciliter l’accès aux outils pour tous, tout en favorisant l’entraide et la durabilité.",
  },
  {
    title: "Pourquoi choisir RentToCraft ?",
    content:
      "Nous croyons en une économie circulaire où chaque outil peut avoir plusieurs vies. En louant ou partageant vos outils, vous contribuez à réduire le gaspillage et à créer du lien social.",
  },
  {
    title: "Comment ça marche ?",
    content:
      "Créez un compte, proposez vos outils ou trouvez ceux dont vous avez besoin, et profitez d’une expérience simple, sécurisée et conviviale.",
  },
];

const AboutPage = () => {
  return (
    <>
      <div className="layout-maxed about-template">
        <Landing
          image="/images/home-landing.jpg"
          title="À propos de RentToCraft"
          description="Découvrez notre mission, nos valeurs et l’équipe derrière la plateforme."
          centered
        />

        <Numbers
          title="Quelques chiffres"
          data={[
            { title: "Outils partagés", value: 120, prefix: "+" },
            { title: "Utilisateurs", value: 3000, prefix: "+" },
            { title: "Communautés locales", value: 25, prefix: "+" },
          ]}
        />
      </div>
      <div className="layout-maxed-4col about-template">
        <Split
          title="Notre mission"
          description="Faciliter l’accès aux outils pour tous, encourager le partage et promouvoir une consommation plus responsable."
          image="/images/partage-jardin.jpeg"
          odd
        />

        <Split
          title="Une communauté engagée"
          description="Rejoignez une communauté d’utilisateurs passionnés, prêts à s’entraider et à partager leurs compétences."
          image="/images/communaute.png"
          dark
        />

        <Accordion
          title="Foire aux questions"
          description="En savoir plus sur RentToCraft et notre fonctionnement."
          items={aboutFaq}
        />
      </div>
    </>
  );
};

export default AboutPage;
