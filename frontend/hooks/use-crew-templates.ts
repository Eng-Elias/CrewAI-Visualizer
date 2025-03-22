import { useQuery } from "@tanstack/react-query";
import { Crew } from "@/utils/api/types";
import { getCrewTemplates } from "@/utils/api/crew-api";

export function useCrewTemplates() {
  const {
    data: templates,
    isLoading,
    error,
  } = useQuery<Crew[]>({
    queryKey: ["crewTemplates"],
    queryFn: getCrewTemplates,
  });

  return {
    templates,
    isLoading,
    error,
  };
}
