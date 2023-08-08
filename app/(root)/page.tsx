import YarnCard from "@/components/cards/YarnCard";
import { fetchYarns } from "@/lib/actions/yarn.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchYarns(1, 30);
  const user = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result?.yarns.length === 0 ? (
          <p className="no-result">No yarns found</p>
        ) : (
          <>
            {result?.yarns.map((yarn) => (
              <YarnCard
                key={yarn._id}
                id={yarn._id}
                currentUserId={user?.id || ""}
                parentId={yarn.parentId}
                content={yarn.text}
                author={yarn.author}
                createdAt={yarn.createdAt}
                comments={yarn.children}
                community={yarn.community}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
