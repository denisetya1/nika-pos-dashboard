import { useQuery } from "@tanstack/react-query";

export const useGetProducts = (qs: string) =>
  useQuery({
    queryKey: ["products", qs],
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
