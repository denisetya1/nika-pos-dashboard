"use client";

import { setSoldOut } from "@/actions/expiredProducts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const SoldOutButton = ({
  title,
  id,
  productName,
}: {
  title: string;
  id: string;
  productName: string;
}) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["soldOut", id],
    mutationFn: async (id: string) => {
      const response = await setSoldOut(id, true);
    },
    onSuccess: (data) => {
      console.log("Sold out status updated:", data);
      router.refresh(); // Refresh the page to reflect changes
    },
    onError: (error) => {
      console.error("Error updating sold out status:", error);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{isPending ? "..." : title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Sold Out</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DialogDescription>
            {`Apakah Anda yakin ingin menandai "${productName}" ini sebagai Sold Out?`}
          </DialogDescription>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => mutate(id)}
            disabled={isPending}
          >
            Ya
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Batal
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SoldOutButton;
