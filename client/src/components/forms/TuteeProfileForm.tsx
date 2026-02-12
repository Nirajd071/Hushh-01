import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import type { TuteeProfile, CreateTuteeProfileRequest, UpdateTuteeProfileRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = api.tutees.me.upsertProfile.input;
type FormValues = z.infer<typeof formSchema>;

export function TuteeProfileForm({
  initial,
  onSubmit,
  isPending,
}: {
  initial: TuteeProfile | null;
  onSubmit: (values: CreateTuteeProfileRequest | UpdateTuteeProfileRequest) => void;
  isPending?: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: initial?.university ?? "",
      yearOfStudy: initial?.yearOfStudy ?? undefined,
      major: initial?.major ?? "",
      subjects: initial?.subjects ?? [],
      timezone: initial?.timezone ?? "America/New_York",
    },
  });

  const [subjectsText, setSubjectsText] = React.useState(
    (initial?.subjects ?? []).join(", "),
  );

  React.useEffect(() => {
    form.reset({
      university: initial?.university ?? "",
      yearOfStudy: initial?.yearOfStudy ?? undefined,
      major: initial?.major ?? "",
      subjects: initial?.subjects ?? [],
      timezone: initial?.timezone ?? "America/New_York",
    });
    setSubjectsText((initial?.subjects ?? []).join(", "));
  }, [initial]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (values: FormValues) => {
    const subjects = subjectsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({ ...values, subjects });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-4"
        data-testid="tutee-profile-form"
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
                    placeholder="e.g., UC Berkeley"
                    data-testid="tutee-profile-university"
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
                    placeholder="e.g., Economics"
                    data-testid="tutee-profile-major"
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
                    placeholder="e.g., 2"
                    inputMode="numeric"
                    data-testid="tutee-profile-year"
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
                    data-testid="tutee-profile-timezone"
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Subjects you want help with</FormLabel>
          <FormControl>
            <Input
              value={subjectsText}
              onChange={(e) => setSubjectsText(e.target.value)}
              placeholder="e.g., Calculus, Microeconomics, CS50"
              data-testid="tutee-profile-subjects"
              className="rounded-xl"
            />
          </FormControl>
          <div className="mt-1 text-xs text-muted-foreground">
            Comma-separated. This helps tutors tailor session proposals.
          </div>
        </FormItem>

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
            data-testid="tutee-profile-save"
          >
            {isPending ? "Saving..." : "Save tutee profile"}
          </Button>
          <div className="text-xs text-muted-foreground">
            Tip: Keep subjects focused—3–6 is perfect.
          </div>
        </div>
      </form>
    </Form>
  );
}
