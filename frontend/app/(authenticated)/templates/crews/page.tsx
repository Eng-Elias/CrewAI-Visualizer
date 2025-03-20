"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Pencil,
  Eye,
  Users,
  Trash2,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CrewTemplateModal } from "@/components/modals/crew-template-modal";
import { Crew } from "@/utils/api/types";
import { deleteCrew, getCrewTemplates } from "@/utils/api/crew-api";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CrewTemplatesPage() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [filteredCrews, setFilteredCrews] = useState<Crew[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [crewToDelete, setCrewToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  console.log(crews, filteredCrews);

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        setIsLoading(true);
        const data = await getCrewTemplates();
        setCrews(data);
        setFilteredCrews(data);
      } catch (error) {
        console.error("Failed to fetch crews:", error);
        toast({
          title: "Error",
          description: "Failed to fetch crews. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrews();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCrews(crews);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = crews.filter(
        (crew) =>
          crew.name.toLowerCase().includes(query) ||
          (crew.description && crew.description.toLowerCase().includes(query))
      );
      setFilteredCrews(filtered);
    }
  }, [searchQuery, crews]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteCrew = async () => {
    if (!crewToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCrew(crewToDelete);

      // Update local state
      setCrews(crews.filter((crew) => crew.id !== crewToDelete));
      setFilteredCrews(
        filteredCrews.filter((crew) => crew.id !== crewToDelete)
      );

      toast({
        title: "Success",
        description: "Crew deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete crew:", error);
      toast({
        title: "Error",
        description: "Failed to delete crew. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setCrewToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Crews</h1>
            <p className="text-muted-foreground">
              Browse and create crews with predefined agents and tasks
            </p>
          </div>
          <Button asChild>
            <Link href="/templates/crews/new">
              <Plus className="mr-2 h-4 w-4" />
              New Crew
            </Link>
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search crews..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCrews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No crews found</p>
            {searchQuery && (
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCrews.map((crew) => (
              <Card key={crew.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{crew.name}</CardTitle>
                    <Badge variant="secondary">
                      <Users className="mr-2 h-4 w-4" />
                      {crew.crew_agents?.length || 0} Agents
                    </Badge>
                  </div>
                  <CardDescription>{crew.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {crew.crew_agents?.map((crewAgent) => (
                      <Badge
                        key={`${crewAgent.agent_id}-${crewAgent.role}`}
                        variant="outline"
                      >
                        {crewAgent.role}
                      </Badge>
                    ))}
                    {(!crew.crew_agents || crew.crew_agents.length === 0) && (
                      <span className="text-sm text-muted-foreground">
                        No agents assigned
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCrew(crew)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {!crew.is_builtin && (
                    <>
                      <Button variant="outline" asChild>
                        <Link href={`/templates/crews/${crew.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setCrewToDelete(crew.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedCrew && (
        <CrewTemplateModal
          isOpen={!!selectedCrew}
          onClose={() => setSelectedCrew(null)}
          template={selectedCrew}
        />
      )}

      <AlertDialog
        open={crewToDelete !== null}
        onOpenChange={(open) => !open && setCrewToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              crew and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCrew} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
