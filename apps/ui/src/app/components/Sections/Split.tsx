interface SplitProps {
  readonly image: string;
  readonly title: string;
  readonly dark?: boolean;
  readonly description?: string;
  readonly odd?: boolean;
  readonly subTitle?: string;
}

const Split = ({
  subTitle,
  title,
  description,
  image,
  odd = false,
  dark = false,
}: SplitProps) => {
  return (
    <div
      className={`split layout-hero-4col align-items-center ${odd ? "odd" : ""} ${dark ? "dark" : ""}`}
    >
      <div className="content">
        {subTitle && <h6 className="sub-title">{subTitle}</h6>}

        <h2 className="title">{title}</h2>

        {description && <p className="description">{description}</p>}
      </div>
      <div className="image-container">
        <img src={image} alt="" className="img block" />
      </div>
    </div>
  );
};

export default Split;
