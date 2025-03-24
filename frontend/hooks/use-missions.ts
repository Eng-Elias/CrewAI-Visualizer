import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mission, MissionCreateDto } from "@/utils/api/types";
import { missionApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export function useMissions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: missions,
    isLoading,
    error,
  } = useQuery<Mission[]>({
    queryKey: ["missions"],
    queryFn: () => missionApi.getAll(),
  });

  const { mutate: createMission } = useMutation({
    mutationFn: (newMission: MissionCreateDto) => missionApi.create(newMission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast({
        title: "Success",
        description: "Mission created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create mission",
        variant: "destructive",
      });
    },
  });

  return {
    missions,
    isLoading,
    error,
    createMission,
  };
} 