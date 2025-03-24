import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mission, MissionUpdateDto } from "@/utils/api/types";
import { missionApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export function useMission(missionId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: mission,
    isLoading,
    error,
  } = useQuery<Mission>({
    queryKey: ["mission", missionId],
    queryFn: () => missionApi.getById(missionId),
    enabled: !!missionId,
  });

  const { mutate: updateMission } = useMutation({
    mutationFn: (updates: MissionUpdateDto) =>
      missionApi.update(missionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      toast({
        title: "Success",
        description: "Mission updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update mission",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteMission } = useMutation({
    mutationFn: () => missionApi.delete(missionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast({
        title: "Success",
        description: "Mission deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete mission",
        variant: "destructive",
      });
    },
  });

  return {
    mission,
    isLoading,
    error,
    updateMission,
    deleteMission,
  };
} 