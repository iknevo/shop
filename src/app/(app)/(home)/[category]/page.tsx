interface Props {
  params: Promise<{ category: string }>;
}
export default async function Page({ params }: Props) {
  const { category } = await params;
  return <div>{category}</div>;
}
