import { useQuery } from "@tanstack/react-query";

export const useGetDiscounts = (qs: string) => {
  const queryDiscount = useQuery({
    queryKey: ["discounts", qs],
    queryFn: () => {
      return fetch(`/api/dashboard/discounts?${qs}`, {
        method: "GET",
      }).then(async (res) => {
        const json = await res.json();

        if (res.ok) {
          return json;
        } else {
          throw json;
        }
      });
    },
  });

  return queryDiscount;
};

export const useUpdateDiscounts = () => {};

export const useAddDiscounts = () => {};
