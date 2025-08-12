import {
  type FileDto,
  type RentalCatDto,
  type RentalDto,
} from "@rent-to-craft/dtos";
import Link from "next/link";

import AppService from "@/app/services/app.service";

import EditRental from "../Forms/Rental/EditRental";
import EditRentalImages from "../Forms/Rental/EditRentalImages";
import OffCanvas from "../OffCanvas";

type RentalCardProps = {
  readonly rental: RentalDto;
  readonly editMode?: boolean;
  readonly onSuccess?: (rental: RentalDto) => void;
};
const RentalCard = ({
  rental,
  editMode = false,
  onSuccess,
}: RentalCardProps) => {
  let { name, description, cats, slug } = rental;
  const { user, images } = rental;

  const updateRentalData = (updatedRental: RentalDto) => {
    name = updatedRental.name;
    description = updatedRental.description;
    cats = updatedRental.cats;
    slug = updatedRental.slug;
  };

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
        {user?.city && (
          <span className="card-location absolute top-4 left-4 btn btn-white btn-small">
            {user.city.name}
          </span>
        )}
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

        {editMode && (
          <div className="card-actions flex flex-wrap gap-10">
            <OffCanvas
              buttonContent="Modifier"
              buttonClassName="btn btn-underline-primary"
            >
              <EditRental
                rental={rental}
                onSuccess={(updatedRental) => {
                  updateRentalData(updatedRental);
                  if (onSuccess) {
                    onSuccess(updatedRental);
                  }
                }}
              />
            </OffCanvas>
            <OffCanvas
              buttonContent="Modifier les images"
              buttonClassName="btn btn-underline-primary"
            >
              <EditRentalImages
                initData={rental}
                onSuccess={() => {
                  if (onSuccess) {
                    onSuccess(rental);
                  }
                }}
              />
            </OffCanvas>
          </div>
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
