"use client";

import { Button } from "@/components/common/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/axios";
import { uploadImage } from "@/lib/blob";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PackagePlusIcon, XIcon } from "lucide-react";
import { useEffect, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "home", label: "Home & Kitchen" },
] as const;

const schema = z.object({
  description: z.string().min(1, "Description is required"),
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be greater than zero"),
  in_stock: z.number().int("Stock must be a whole number").nonnegative("Stock cannot be negative"),
  image_url: z
    .custom<FileList>(
      (value) => typeof FileList === "undefined" || value instanceof FileList,
      "Please choose a valid image file.",
    )
    .optional(),
  category: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function AddProductDialog({ open, setOpen }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      description: "",
      name: "",
      price: 0,
      in_stock: 0,
      category: "",
    },
  });

  const queryClient = useQueryClient();
  const { isPending, ...addProductMutation } = useMutation({
    mutationFn: async (data: Schema) => {
      const image = data.image_url?.item(0);
      const imageUrl = image ? await uploadImage(image, "products") : null;

      return (await api.post("/api/products/", {
        name: data.name,
        description: data.description,
        price: data.price,
        in_stock: data.in_stock,
        category: data.category || null,
        image_url: imageUrl,
      })).data;
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      setOpen(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please sign in before adding a product.");
          return;
        }
        if (error.response?.status === 403) {
          toast.error("Only staff administrators can add products.");
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
      toast.error("Unable to add the product. Please try again.");
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
        aria-labelledby="add-product-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <form
          onSubmit={handleSubmit((data) => addProductMutation.mutate(data))}
          className="flex min-h-0 flex-1 flex-col"
        >
          <header className="flex shrink-0 items-start justify-between border-gray-200 border-b px-6 py-5 dark:border-slate-700">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-surface text-primary">
                <PackagePlusIcon size={21} />
              </span>
              <div>
                <h2 id="add-product-title" className="font-semibold text-gray-900 text-xl dark:text-white">
                  Add product
                </h2>
                <p className="mt-1 text-gray-500 text-sm dark:text-slate-400">
                  Add inventory details and an optional product image.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close add product dialog"
            >
              <XIcon size={20} />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-5">
            <section>
              <h3 className="mb-4 font-semibold text-gray-900 text-sm dark:text-slate-100">Product information</h3>
              <Input
                label="Product name"
                type="text"
                placeholder="e.g. Wireless headphones"
                fullWidth
                error={errors.name?.message}
                {...register("name")}
              />
              <div className="mb-4">
                <label htmlFor="product-description" className="mb-1 block font-medium text-gray-700 text-sm dark:text-slate-300">
                  Description
                </label>
                <textarea
                  id="product-description"
                  rows={4}
                  placeholder="Describe the product and its key features"
                  className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("description")}
                />
                {errors.description && <p className="mt-1 text-red-600 text-sm">{errors.description.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  fullWidth
                  error={errors.price?.message}
                  {...register("price", { setValueAs: (value) => value === "" ? Number.NaN : Number(value) })}
                />
                <Input
                  label="Stock quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  fullWidth
                  error={errors.in_stock?.message}
                  {...register("in_stock", { setValueAs: (value) => value === "" ? Number.NaN : Number(value) })}
                />
              </div>
              <div>
                <label htmlFor="product-category" className="mb-1 block font-medium text-gray-700 text-sm dark:text-slate-300">
                  Category
                </label>
                <select
                  id="product-category"
                  {...register("category")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
            </section>

            <section className="border-gray-200 border-t pt-5 dark:border-slate-700">
              <h3 className="mb-1 font-semibold text-gray-900 text-sm dark:text-slate-100">Product image</h3>
              <p className="mb-3 text-gray-500 text-xs dark:text-slate-400">PNG, JPG or WebP, up to 4 MB. Images are stored in Vercel Blob.</p>
              <Input
                label="Choose image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                fullWidth
                error={errors.image_url?.message}
                className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-brand-surface file:px-3 file:py-1.5 file:font-medium file:text-primary"
                {...register("image_url")}
              />
            </section>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-gray-200 border-t bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-950/50 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? "Adding product…" : "Add product"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
