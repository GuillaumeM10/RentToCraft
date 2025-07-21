interface RentalPageProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams?: Promise<{ [key: string]: string[] | string | undefined }>;
}

const Tools = async ({ params }: RentalPageProps) => {
  const { id } = await params;

  return (
    <div>
      <h1>Tools Page {id}</h1>
    </div>
  );
};

export default Tools;
