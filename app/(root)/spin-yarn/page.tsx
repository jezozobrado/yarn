import SpinYarn from "@/components/forms/SpinYarn";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <>
      <h1 className="head-text">Spin a yarn</h1>
      <SpinYarn userId={userInfo._id} />
    </>
  );
};

export default page;
