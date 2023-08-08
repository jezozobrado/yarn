"use client";

import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { usePathname, useRouter } from "next/navigation";
import { yarnSchema } from "@/lib/validations/yarn";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { spinYarn } from "@/lib/actions/yarn.actions";

const SpinYarn = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof yarnSchema>>({
    resolver: zodResolver(yarnSchema),
    defaultValues: {
      yarn: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof yarnSchema>) => {
    await spinYarn({
      text: values.yarn,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="yarn"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Spin yarn
        </Button>
      </form>
    </FormProvider>
  );
};

export default SpinYarn;
