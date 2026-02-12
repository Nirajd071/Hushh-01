import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import type { CreateTutorProfileRequest, UpdateTutorProfileRequest, TutorProfile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = api.tutors.me.upsertProfile.input;

type FormValues = z.infer<typeof formSchema>;

export function TutorProfileForm({
  initial,
  onSubmit,
  isPending,
}: {
  initial: TutorProfile | null;
  onSubmit: (values: CreateTutorProfileRequest | UpdateTutorProfileRequest) => void;
  isPending?: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: initial?.university ?? "",
      yearOfStudy: initial?.yearOfStudy ?? undefined,
      major: initial?.major ?? "",
      bio: initial?.bio ?? "",
      isActive: initial?.isActive ?? true,
      timezone: initial?.timezone ?? "America/New_York",
    },
  });

  React.useEffect(() => {
    form.reset({
      university: initial?.university ?? "",
      yearOfStudy: initial?.yearOfStudy ?? undefined,
      major: initial?.major ?? "",
      bio: initial?.bio ?? "",
      isActive: initial?.isActive ?? true,
      timezone: initial?.timezone ?? "America/New_York",
    });
  }, [initial]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className="space-y-4"
        data-testid="tutor-profile-form"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Northeastern University"
                    data-testid="tutor-profile-university"
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Computer Science"
                    data-testid="tutor-profile-major"
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="yearOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of study</FormLabel>
                <FormControl>
                  <Input
                    value={field.value === undefined || field.value === null ? "" : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    placeholder="e.g., 3"
                    inputMode="numeric"
                    data-testid="tutor-profile-year"
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="America/New_York"
                    data-testid="tutor-profile-timezone"
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Your teaching style, what you love helping with, and how you structure sessions."
                  data-testid="tutor-profile-bio"
                  className="min-h-[110px] rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <Button
            type="submit"
            disabled={!!isPending}
            className="
              rounded-xl px-6
              bg-gradient-to-r from-primary to-primary/80
              text-primary-foreground shadow-lg shadow-primary/20
              hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
              active:translate-y-0 active:shadow-md
              transition-all duration-200
            "
            data-testid="tutor-profile-save"
          >
            {isPending ? "Saving..." : "Save tutor profile"}
          </Button>

          <div className="text-xs text-muted-foreground">
            Tip: Keep it short, specific, and friendly.
          </div>
        </div>
      </form>
    </Form>
  );
}
