"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { commentSchema } from "@/lib/validations/yarn";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToYarn } from "@/lib/actions/yarn.actions";

interface Props {
  yarnId: string;
  currentUserImg: string;
  currentUserId: string;
}
const Comment = ({ yarnId, currentUserImg, currentUserId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      yarn: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    await addCommentToYarn(
      yarnId,
      values.yarn,
      JSON.parse(currentUserId),
      pathname
    );
    form.reset();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="yarn"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full items-center">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </FormProvider>
  );
};

export default Comment;
