"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Yarn from "../models/yarn.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function spinYarn({ text, author, communityId, path }: Params) {
  try {
    connectToDB();
    // create yarn
    const spunYarn = await Yarn.create({ text, author, community: null });

    // update user
    await User.findByIdAndUpdate(author, { $push: { yarns: spunYarn._id } });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error spinning yarn: ${error.message}`);
  }
}
