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

export async function fetchYarnById(id: string) {
  connectToDB();
  try {
    // TODO: populate community
    const yarn = await Yarn.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },
      })
      .exec();

    return yarn;
  } catch (error: any) {
    throw new Error(`Error fetching yarnL ${error.message}`);
  }
}

export async function addCommentToYarn(
  yarnId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const originalYarn = await Yarn.findById(yarnId);

    if (!originalYarn) throw new Error("Yarn not found");

    const commentYarn = new Yarn({
      text: commentText,
      author: userId,
      parentId: yarnId,
    });

    const savedCommentYarn = await commentYarn.save();

    originalYarn.children.push(savedCommentYarn._id);

    await originalYarn.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`);
  }
}
