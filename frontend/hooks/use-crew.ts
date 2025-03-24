import { useQuery } from "@tanstack/react-query";
import { Crew } from "@/utils/api/types";
import { crewApi } from "@/utils/api";

export function useCrew(crewId: number) {
  const {
    data: crew,
    isLoading,
    error,
  } = useQuery<Crew>({
    queryKey: ["crew", crewId],
    queryFn: () => crewApi.getById(crewId),
    enabled: !!crewId,
  });

  return {
    crew,
    isLoading,
    error,
  };
}
