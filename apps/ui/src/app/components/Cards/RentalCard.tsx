import { RentalCatDto, RentalDto } from "@rent-to-craft/dtos";
import Link from "next/link";

const RentalCard = ({
  name,
  description,
  images,
  cats,
  user,
  slug,
}: RentalDto) => {
  return (
    <div className="rental-card">
      <Link href={slug} className="card-link">
        <div className="card-image">
          <img src={images[0].name} alt={name} />
          {user?.city && (
            <span className="card-location">{user.city.name}</span>
          )}
          {cats && cats.length > 0 && (
            <span className="card-category">
              {cats.map((cat: RentalCatDto) => cat.name).join(", ")}
            </span>
          )}
        </div>
        <div className="card-content">
          <div className="card-user">
            {user?.firstName && (
              <span className="card-owner">{user.firstName}</span>
            )}
            {user?.profilePicture && (
              <img
                src={user.profilePicture.file}
                alt={user?.firstName ? user.firstName : "Image de profile"}
                className="card-pp"
              />
            )}
          </div>
          <h2 className="card-title">{name}</h2>
          {description && <p className="card-description">{description}</p>}
        </div>
      </Link>
    </div>
  );
};

export default RentalCard;
