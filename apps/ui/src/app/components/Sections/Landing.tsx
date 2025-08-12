import Link from "next/link";

interface LandingProps {
  readonly centered?: boolean;
  readonly description?: string;
  readonly image?: string;
  readonly title?: string;
  readonly button?: {
    text: string;
    href: string;
  };
}

const Landing = ({
  image,
  title,
  description,
  button,
  centered,
}: LandingProps) => {
  return (
    <div className="landing layout-hero">
      <div className="background-container">
        <img src={image} alt="" className="background block" />
      </div>

      <div
        className={`flex flex-col ${centered ? "justify-center items-center tac" : "justify-end"}`}
      >
        <h1 className="text-white text-4xl">{title}</h1>
        <p className="description">{description}</p>
        {button && (
          <Link href={button?.href} className="btn btn-outline-white">
            {button?.text}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Landing;
