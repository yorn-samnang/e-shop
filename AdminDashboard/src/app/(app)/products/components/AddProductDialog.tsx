import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { isValid, z } from "zod";

const schema = z.object({
  description: z.string().min(1, "Description is required"),
  name: z.string().min(1, "Name is required"),
  price: z.number(),
  in_stock: z.number(),
  image_url: z.any(),
});

type Schema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};
const AddProductDialog = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const { isPending, ...addProductMutation } = useMutation({
    mutationFn: async (data: Schema) => {
      const newData = { ...data, image_url: data.image_url.item(0) };
      const res = await api.post("/api/products/", newData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      props.setOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit = (data: Schema) => {
    addProductMutation.mutate(data);
  };

  if (!props.open) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => props.setOpen(false)}
        className="absolute inset-0 z-90 flex items-center justify-center bg-[#0000008A] "
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md space-y-8"
        >
          <Card className="px-8 py-4">
            <div className="text-center">
              <h1 className="mb-4 font-bold text-2xl text-gray-900">
                Add a product!
              </h1>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <Input
                label="Product Name"
                type="text"
                fullWidth
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Product Description"
                type="text"
                fullWidth
                error={errors.description?.message}
                {...register("description", {})}
              />

              <Input
                label="Price"
                type="number"
                fullWidth
                error={errors.name?.message}
                {...register("price", {
                  setValueAs: (v) => Number(v),
                })}
              />

              <Input
                label="Stock"
                type="number"
                fullWidth
                error={errors.name?.message}
                {...register("in_stock", {
                  setValueAs: (v) => Number(v),
                })}
              />

              <Input
                label="Image"
                type="file"
                accept="image/*"
                fullWidth
                error={errors.name?.message}
                {...register("image_url", {})}
              />

              <Button
                disabled={isPending || !isValid}
                type="submit"
                fullWidth
                size="lg"
              >
                Add Product
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};
export default AddProductDialog;
