import * as React from "react";
import { z } from "zod";
import { api } from "@shared/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TutorSubject } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = api.sessions.create.input;
type Values = z.infer<typeof schema>;

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function BookSessionDialog({
  open,
  onOpenChange,
  tutorId,
  subjects,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tutorId: string;
  subjects: TutorSubject[];
  onSubmit: (values: Values) => void;
  isPending?: boolean;
}) {
  const defaultSubject = subjects?.[0]?.subject ?? "";

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      tutorId,
      // tuteeId omitted; backend uses current user
      subject: defaultSubject,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      durationMinutes: 60,
      hourlyRateCents: subjects?.[0]?.hourlyRateCents ?? 2500,
      status: "pending",
      paymentStatus: "pending",
      tuteeNotes: "",
    } as any,
  });

  React.useEffect(() => {
    if (!open) return;
    const first = subjects?.[0];
    form.reset({
      tutorId,
      subject: first?.subject ?? "",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      durationMinutes: 60,
      hourlyRateCents: first?.hourlyRateCents ?? 2500,
      status: "pending",
      paymentStatus: "pending",
      tuteeNotes: "",
    } as any);
  }, [open, tutorId, subjects]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedSubject = form.watch("subject");
  React.useEffect(() => {
    const match = subjects.find((s) => s.subject === selectedSubject);
    if (match) form.setValue("hourlyRateCents", match.hourlyRateCents as any);
  }, [selectedSubject]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[620px]" data-testid="book-session-dialog">
        <DialogHeader>
          <DialogTitle className="font-display tracking-tight">Book a session</DialogTitle>
          <DialogDescription>
            Pick a topic, propose a time, and add context. The tutor will confirm.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="book-session-form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl" data-testid="book-session-subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s.id} value={s.subject}>
                            {s.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        value={String(field.value ?? 60)}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        inputMode="numeric"
                        className="rounded-xl"
                        placeholder="60"
                        data-testid="book-session-duration"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposed time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={
                        field.value instanceof Date
                          ? toLocalDatetimeValue(field.value)
                          : toLocalDatetimeValue(new Date(field.value as any))
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      className="rounded-xl"
                      data-testid="book-session-datetime"
                    />
                  </FormControl>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Stored as a Date on the API (coerced).
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tuteeNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes for the tutor</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[90px] rounded-xl"
                      placeholder="What are you stuck on? Any materials you want to review?"
                      data-testid="book-session-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <div className="text-sm font-medium">Pricing preview</div>
              <div className="mt-1 text-sm text-muted-foreground">
                The backend may compute totals if omitted. We send hourly rate and duration.
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Hourly rate</div>
                <div className="font-medium" data-testid="book-session-rate">
                  ${Math.round((form.watch("hourlyRateCents") ?? 0) / 100)}/hr
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
                data-testid="book-session-cancel"
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
                data-testid="book-session-submit"
              >
                {isPending ? "Requesting..." : "Request session"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
