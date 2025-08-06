import SearchInput from "@/components/SearchInput";
import SearchContent from "@/components/SearchContent";
import getSongsByTitle from "@/actions/getSongsByTitle";

interface Props {
  searchParams: {
    title: string;
  };
}

export const revalidate = 0;

export default async function SearchPage({ searchParams }: Props) {
  const title = searchParams.title ?? "";
  const songs = await getSongsByTitle(title);

  return (
    <div className="flex h-full w-full flex-col justify-start items-center gap-2">
      <SearchInput />
      <SearchContent songs={songs} />
    </div>
  );
}
