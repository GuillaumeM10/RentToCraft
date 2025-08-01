interface LandingProps {
  readonly description?: string;
  readonly image?: string;
  readonly title?: string;
  readonly button?: {
    text: string;
    href: string;
  };
}

const Landing = ({ image, title, description, button }: LandingProps) => {
  return (
    <div className="landing layout-hero">
      <div className="background-container">
        <img src={image} alt="" className="background block" />
      </div>

      <div className="flex flex-col justify-end">
        <h1 className="text-white">{title}</h1>
        <p className="description">{description}</p>
        {button && (
          <a href={button?.href} className="btn btn-outline-white">
            {button?.text}
          </a>
        )}
      </div>
    </div>
  );
};

export default Landing;
