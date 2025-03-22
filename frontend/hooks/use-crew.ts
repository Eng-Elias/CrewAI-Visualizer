import { useQuery } from "@tanstack/react-query";
import { getCrew } from "@/utils/api/crew-api";
import { Crew } from "@/utils/api/types";

export function useCrew(crewId: number) {
  const {
    data: crew,
    isLoading,
    error,
  } = useQuery<Crew>({
    queryKey: ["crew", crewId],
    queryFn: () => getCrew(crewId),
    enabled: !!crewId,
  });

  return {
    crew,
    isLoading,
    error,
  };
}
