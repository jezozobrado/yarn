import { fetchUserYarns } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import YarnCard from "../cards/YarnCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const YarnsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserYarns(accountId);

  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.yarns.map((yarn: any) => (
        <YarnCard
          key={yarn._id}
          id={yarn._id}
          currentUserId={currentUserId}
          parentId={yarn.parentId}
          content={yarn.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: yarn.author.name,
                  image: yarn.author.image,
                  id: yarn.author.id,
                }
          }
          createdAt={yarn.createdAt} // todo
          comments={yarn.children}
          community={yarn.community}
        />
      ))}
    </section>
  );
};

export default YarnsTab;
