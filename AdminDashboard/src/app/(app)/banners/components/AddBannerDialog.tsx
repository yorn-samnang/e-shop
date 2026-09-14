"use client";

import { Button } from "@/components/common/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/axios";
import { uploadImage } from "@/lib/blob";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useEffect, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  image: z
    .custom<FileList>(
      (value) => typeof FileList === "undefined" || value instanceof FileList,
      "Please choose a valid image file.",
    )
    .refine((files) => files && files.length > 0, "Image is required"),
  button_label: z.string().optional(),
  button_link: z.string().optional(),
  order: z.number().int().nonnegative(),
  is_active: z.boolean(),
});

type Schema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function AddBannerDialog({ open, setOpen }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      subtitle: "",
      button_label: "",
      button_link: "",
      order: 0,
      is_active: true,
    },
  });

  const queryClient = useQueryClient();
  const { isPending, ...mutation } = useMutation({
    mutationFn: async (data: Schema) => {
      const image = data.image.item(0);
      if (!image) throw new Error("Image is required");
      const imageUrl = await uploadImage(image, "banners");

      return (await api.post("/api/banners/", {
        title: data.title,
        subtitle: data.subtitle || null,
        image: imageUrl,
        button_label: data.button_label || null,
        button_link: data.button_link || null,
        order: data.order,
        is_active: data.is_active,
      })).data;
    },
    onSuccess: () => {
      toast.success("Banner added successfully");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      reset();
      setOpen(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please sign in first.");
          return;
        }
        if (error.response?.status === 403) {
          toast.error("Admin access required.");
          return;
        }
        const data = error.response?.data;
        if (data && typeof data === "object") {
          const message = Object.values(data)
            .flat()
            .filter((value): value is string => typeof value === "string")
            .join(" ");
          if (message) {
            toast.error(message);
            return;
          }
        }
      }
      if (error instanceof Error && error.message) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to add banner. Please try again.");
    },
  });

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isPending, open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={() => !isPending && setOpen(false)}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-banner-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="flex min-h-0 flex-1 flex-col"
        >
          <header className="flex shrink-0 items-start justify-between border-gray-200 border-b px-6 py-5 dark:border-slate-700">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-surface text-primary">
                <ImagePlusIcon size={21} />
              </span>
              <div>
                <h2 id="add-banner-title" className="font-semibold text-gray-900 text-xl dark:text-white">
                  Add banner
                </h2>
                <p className="mt-1 text-gray-500 text-sm dark:text-slate-400">
                  Create a promotional slide for the storefront homepage.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close add banner dialog"
            >
              <XIcon size={20} />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-5">
            <section>
              <h3 className="mb-4 font-semibold text-gray-900 text-sm dark:text-slate-100">Banner content</h3>
              <Input
                label="Title"
                type="text"
                placeholder="e.g. Summer essentials"
                fullWidth
                error={errors.title?.message}
                {...register("title")}
              />
              <Input
                label="Subtitle"
                type="text"
                placeholder="A short supporting message (optional)"
                fullWidth
                error={errors.subtitle?.message}
                {...register("subtitle")}
              />
              <Input
                label="Banner image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                fullWidth
                error={errors.image?.message}
                className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-brand-surface file:px-3 file:py-1.5 file:font-medium file:text-primary"
                {...register("image")}
              />
              <p className="-mt-2 text-gray-500 text-xs dark:text-slate-400">
                Use a wide image for the best result. PNG, JPG or WebP, up to 4 MB. Stored in Vercel Blob.
              </p>
            </section>

            <section className="border-gray-200 border-t pt-5 dark:border-slate-700">
              <h3 className="mb-4 font-semibold text-gray-900 text-sm dark:text-slate-100">Call to action</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Button label"
                  type="text"
                  placeholder="e.g. Shop now"
                  fullWidth
                  error={errors.button_label?.message}
                  {...register("button_label")}
                />
                <Input
                  label="Button link"
                  type="text"
                  placeholder="e.g. /products"
                  fullWidth
                  error={errors.button_link?.message}
                  {...register("button_link")}
                />
              </div>
            </section>

            <section className="border-gray-200 border-t pt-5 dark:border-slate-700">
              <h3 className="mb-4 font-semibold text-gray-900 text-sm dark:text-slate-100">Publishing</h3>
              <div className="grid items-end gap-4 sm:grid-cols-2">
                <Input
                  label="Display order"
                  type="number"
                  min="0"
                  step="1"
                  fullWidth
                  error={errors.order?.message}
                  {...register("order", { setValueAs: (value) => value === "" ? 0 : Number(value) })}
                />
                <label className="mb-4 flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 dark:border-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    {...register("is_active")}
                  />
                  <span>
                    <span className="block font-medium text-gray-800 text-sm dark:text-slate-200">Publish immediately</span>
                    <span className="block text-gray-500 text-xs dark:text-slate-400">Visible on the storefront</span>
                  </span>
                </label>
              </div>
            </section>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-gray-200 border-t bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-950/50 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? "Adding banner…" : "Add banner"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
