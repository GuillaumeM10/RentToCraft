import { Fragment } from "react";

import Accordion from "./components/Sections/Accordion";
import Landing from "./components/Sections/Landing";
import Numbers from "./components/Sections/Numbers";
import Split from "./components/Sections/Split";
import SwiperRentals from "./components/Sections/SwiperRentals";
import Wellcome from "./components/Sections/Wellcome";

export default function HomePage() {
  return (
    <Fragment>
      <div className="layout-maxed home-template">
        <Landing
          image="/images/home-landing.jpg"
          title="RentToCraft"
          description="Louez et partagez des outils facilement avec RentToCraft"
          button={{ text: "En savoir plus", href: "#" }}
          centered
        />

        <Wellcome />

        <Numbers
          title="Chiffres clés"
          data={[
            { title: "Outils disponibles", value: 120, prefix: "+" },
            { title: "Utilisateurs", value: 3000, prefix: "+" },
            { title: "Locations effectuées", value: 15_000, prefix: "+" },
          ]}
        />
      </div>

      <div className="layout-maxed-4col home-template">
        <Split
          title="Louez vos outils"
          description="Facilitez la location de vos outils avec RentToCraft"
          image="/images/outils.jpeg"
          odd
        />

        <Split
          title="Partagez vos compétences"
          description="Partagez vos compétences et aidez les autres à trouver les outils dont ils ont besoin"
          image="/images/partage-jardin.jpeg"
        />

        <Accordion
          title="Questions fréquentes"
          description="Trouvez des réponses à vos questions sur la location d'outils"
          items={[
            {
              title: "Comment louer un outil ?",
              content:
                "Pour louer un outil, il vous suffit de créer un compte et de suivre les instructions sur notre site.",
            },
            {
              title: "Quels types d'outils puis-je louer ?",
              content:
                "Vous pouvez louer une grande variété d'outils, des outils de jardinage aux outils de construction.",
            },
            {
              title: "Comment puis-je retourner un outil ?",
              content:
                "Pour retourner un outil, veuillez suivre les instructions de retour fournies avec votre commande.",
            },
          ]}
        />

        <Split
          title="Rejoignez la communauté"
          description="Participez à notre communauté pour échanger des conseils et des astuces sur l'utilisation des outils"
          image="/images/communaute.png"
          dark
          odd
        />
      </div>

      <div className="layout-maxed home-template overflow-hidden">
        <SwiperRentals />
      </div>
    </Fragment>
  );
}
