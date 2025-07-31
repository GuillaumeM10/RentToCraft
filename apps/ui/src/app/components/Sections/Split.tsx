interface SplitProps {
  sub_title?: string;
  description?: string;
  title: string;
  image: string;
  odd?: boolean;
  dark?: boolean;
}

const Split = ({
  sub_title,
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
        {sub_title && <h6 className="sub-title">{sub_title}</h6>}

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
