import {
  type FileDto,
  type RentalCatDto,
  type RentalDto,
} from "@rent-to-craft/dtos";
import Link from "next/link";

import AppService from "@/app/services/app.service";

type RentalCardProps = {
  readonly rental: RentalDto;
  readonly editMode?: boolean;
};
const RentalCard = ({ rental, editMode = false }: RentalCardProps) => {
  const { name, description, images, cats, user, slug } = rental;

  const content = (
    <>
      <div className="card-image">
        <img
          src={
            images[0]
              ? AppService.createImageUrl(images[0] as FileDto)
              : "https://images-ext-1.discordapp.net/external/rz9ILA7keWFyHgDlp2bRybCdRx2mWg1R4sYXG7Gntmw/https/picsum.photos/1280/720?format=webp&width=1600&height=900"
          }
          alt={name}
          className="image"
        />
        {user?.city && <span className="card-location">{user.city.name}</span>}
        <span className="quantity">{rental.quantity}</span>
      </div>
      <div className="card-content">
        <div className="card-category">
          {cats?.map((cat: RentalCatDto) => (
            <span key={cat.id} className="card-cat">
              {cat.name}
            </span>
          ))}
        </div>
        <div className="card-user flex items-center gap-10 mb-10 mt-ato">
          <img
            src={
              user.profilePicture
                ? AppService.createImageUrl(user.profilePicture as FileDto)
                : "/images/default-pp.png"
            }
            alt={user?.firstName ?? "Image de profile"}
            className="pp"
          />
          {user?.firstName && (
            <span className="card-owner">{user.firstName}</span>
          )}
        </div>
        <h2 className="card-title">{name}</h2>
        {description && (
          <p className="card-description mt-auto">{description}</p>
        )}
      </div>
    </>
  );

  return (
    <div className="rental-card">
      {editMode ? (
        content
      ) : (
        <Link href={`/rental/${slug}`} className="card-link">
          {content}
        </Link>
      )}
    </div>
  );
};

export default RentalCard;
