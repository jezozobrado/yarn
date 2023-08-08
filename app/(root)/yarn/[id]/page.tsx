import YarnCard from "@/components/cards/YarnCard";
import Comment from "@/components/forms/Comment";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchYarnById } from "@/lib/actions/yarn.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const yarn = await fetchYarnById(params.id);

  return (
    <section className="relative">
      <div>
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
      </div>
      <div className="mt-7">
        <Comment
          yarnId={yarn.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {yarn.children.map((child: any) => (
          <YarnCard
            key={child._id}
            id={child._id}
            currentUserId={user?.id || ""}
            parentId={child.parentId}
            content={child.text}
            author={child.author}
            createdAt={child.createdAt}
            comments={child.children}
            community={child.community}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default page;
