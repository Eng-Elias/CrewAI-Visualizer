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
import { useAuth } from "@/lib/auth/provider";
import { Task } from "@/utils/api/types";
import { Edit, Eye } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onButtonClick?: () => void;
  isLoading?: boolean;
}

export function TaskCard({
  task,
  onButtonClick,
  isLoading = false,
}: TaskCardProps) {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{task.name}</span>
        </CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold">Expected Output</h4>
          <p className="text-sm text-muted-foreground">
            {task.expected_output}
          </p>
        </div>
        {/* {task.tools && Object.keys(task.tools).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold">Tools</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {Object.keys(task.tools).map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        )} */}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onButtonClick && (
          <Button
            variant="outline"
            size="icon"
            onClick={onButtonClick}
            disabled={isLoading}
          >
            {user?.id === task.user_id ? (
              <Edit className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
