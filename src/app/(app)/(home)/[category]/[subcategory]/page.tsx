interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}
export default async function Page({ params }: Props) {
  const { subcategory, category } = await params;
  return (
    <div>
      {category}============={subcategory}
    </div>
  );
}
