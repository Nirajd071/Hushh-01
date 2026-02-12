import * as React from "react";
import { z } from "zod";
import { api } from "@shared/routes";
import type { TutorSubject } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const createSchema = api.tutors.me.addSubject.input;
const updateSchema = api.tutors.me.updateSubject.input;

type CreateValues = z.infer<typeof createSchema>;
type UpdateValues = z.infer<typeof updateSchema>;

export function TutorSubjectDialog({
  open,
  onOpenChange,
  mode,
  initial,
  onCreate,
  onUpdate,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: TutorSubject | null;
  onCreate?: (values: CreateValues) => void;
  onUpdate?: (values: UpdateValues) => void;
  isPending?: boolean;
}) {
  const schema = mode === "create" ? createSchema : updateSchema;

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "create"
        ? {
            subject: "",
            proficiency: "intermediate",
            hourlyRateCents: 2500,
            description: "",
          }
        : {
            subject: initial?.subject ?? "",
            proficiency: (initial?.proficiency as any) ?? "intermediate",
            hourlyRateCents: initial?.hourlyRateCents ?? 2500,
            description: initial?.description ?? "",
          },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      mode === "create"
        ? {
            subject: "",
            proficiency: "intermediate",
            hourlyRateCents: 2500,
            description: "",
          }
        : {
            subject: initial?.subject ?? "",
            proficiency: (initial?.proficiency as any) ?? "intermediate",
            hourlyRateCents: initial?.hourlyRateCents ?? 2500,
            description: initial?.description ?? "",
          },
    );
  }, [open, mode, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (values: any) => {
    if (mode === "create") onCreate?.(values);
    else onUpdate?.(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[560px]" data-testid="subject-dialog">
        <DialogHeader>
          <DialogTitle className="font-display tracking-tight">
            {mode === "create" ? "Add a subject" : "Edit subject"}
          </DialogTitle>
          <DialogDescription>
            Be specific—good listings convert. Example: “Linear Algebra (proofs + intuition)”.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4" data-testid="subject-form">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Calculus I"
                      className="rounded-xl"
                      data-testid="subject-name"
                      disabled={mode === "edit"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="proficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl" data-testid="subject-proficiency">
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourlyRateCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly rate (USD)</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value === undefined || field.value === null ? "" : String(Math.round(Number(field.value) / 100))}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value) * 100,
                          )
                        }
                        inputMode="numeric"
                        placeholder="e.g., 25"
                        className="rounded-xl"
                        data-testid="subject-rate"
                      />
                    </FormControl>
                    <div className="mt-1 text-xs text-muted-foreground">
                      We store cents. You typed dollars.
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[90px] rounded-xl"
                      placeholder="What you cover, typical session plan, and what students leave with."
                      data-testid="subject-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
                data-testid="subject-cancel"
              >
                Cancel
              </Button>
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
                data-testid="subject-submit"
              >
                {isPending ? "Saving..." : mode === "create" ? "Add subject" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
