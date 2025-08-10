import Signin from "@/app/components/Forms/Auth/Signin";

import Signup from "../components/Forms/Auth/Signup";

export default function AuthPage() {

  return (
    <div className="layout-maxed auth-container py-40">
      <div className="md:grid grid-cols-2 py-36">
        <div className="signin-container pb-36 md:pt-0 md:pr-24">
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte RentToCraft</p>

          <Signin />
        </div>

        <div className="signup-container pt-36 md:pt-0 md:pl-24">
          <h1>Inscription</h1>
          <p>Créez votre compte RentToCraft</p>

          <Signup />
        </div>
      </div>
    </div>
  );
}
