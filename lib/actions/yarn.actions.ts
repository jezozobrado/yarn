"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Yarn from "../models/yarn.model";
import { connectToDB } from "../mongoose";
import { Yanone_Kaffeesatz } from "next/font/google";

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

export async function fetchYarns(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    //Fetch yarns that have no parents (top-level yarns)
    const yarnsQuery = Yarn.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId, image",
        },
      });

    const totalYarnsCount = await Yarn.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const yarns = await yarnsQuery.exec();

    const isNext = totalYarnsCount > skipAmount + yarns.length;

    return { yarns, isNext };
  } catch (error) {}
}
