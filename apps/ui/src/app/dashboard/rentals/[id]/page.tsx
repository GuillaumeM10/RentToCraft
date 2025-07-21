interface RentalPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Rental = async ({ params }: RentalPageProps) => {
  const { id } = await params;

  return (
    <div>
      <h1>Rental Page {id}</h1>
    </div>
  );
};

export default Rental;
