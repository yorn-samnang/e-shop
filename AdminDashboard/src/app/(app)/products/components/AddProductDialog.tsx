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
  price: z.string().min(1, "Price is required"),
  in_stock: z.string().min(1, "In stock is required"),
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
      const res = await api.post("/api/products/", data);
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      props.setOpen(false);
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
      <div className="absolute inset-0 z-90 flex items-center justify-center bg-[#0000008A] ">
        <div className="flex min-h-screen grow items-center justify-center px-4">
          <div className="w-full max-w-md space-y-8">
            <Card className="px-8 py-4">
              <div className="text-center">
                <h1 className="mb-4 font-bold text-2xl text-gray-900">
                  Add a product!
                </h1>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Product Name"
                  type="text"
                  fullWidth
                  error={errors.name?.message}
                  {...register("name", {})}
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
                  {...register("price", {})}
                />

                <Input
                  label="Stock"
                  type="number"
                  fullWidth
                  error={errors.name?.message}
                  {...register("in_stock", {})}
                />

                <Input
                  label="Image"
                  type="image"
                  fullWidth
                  error={errors.name?.message}
                  {...register("image_url", {})}
                />

                <Button
                  disabled={isPending || !isValid}
                  onClick={handleSubmit(onSubmit)}
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
      </div>
    </>
  );
};

export default AddProductDialog;
