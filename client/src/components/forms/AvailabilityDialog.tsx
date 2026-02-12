import * as React from "react";
import { z } from "zod";
import { api } from "@shared/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = api.tutors.me.addAvailability.input;
type Values = z.infer<typeof schema>;

const days = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

export function AvailabilityDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: Values) => void;
  isPending?: boolean;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      dayOfWeek: 1,
      startTime: "16:00",
      endTime: "19:00",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({ dayOfWeek: 1, startTime: "16:00", endTime: "19:00" });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[520px]" data-testid="availability-dialog">
        <DialogHeader>
          <DialogTitle className="font-display tracking-tight">Add availability</DialogTitle>
          <DialogDescription>
            Students will see these windows when booking. Keep it realistic.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="availability-form"
          >
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl" data-testid="availability-day">
                        <SelectValue placeholder="Pick a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {days.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="HH:MM"
                        className="rounded-xl"
                        data-testid="availability-start"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="HH:MM"
                        className="rounded-xl"
                        data-testid="availability-end"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
                data-testid="availability-cancel"
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
                data-testid="availability-submit"
              >
                {isPending ? "Adding..." : "Add window"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
