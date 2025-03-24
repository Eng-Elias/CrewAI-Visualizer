import { useQuery } from "@tanstack/react-query";
import { Crew } from "@/utils/api/types";
import { crewApi } from "@/utils/api";

export function useCrewTemplates() {
  const {
    data: templates,
    isLoading,
    error,
  } = useQuery<Crew[]>({
    queryKey: ["crewTemplates"],
    queryFn: () => crewApi.getTemplates(),
  });

  return {
    templates,
    isLoading,
    error,
  };
}
