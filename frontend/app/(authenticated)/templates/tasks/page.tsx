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
import { Plus, Search, Pencil, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TaskTemplateModal } from "@/components/modals/task-template-modal";
import { taskApi } from "@/utils/api";
import { Task } from "@/utils/api/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastUtils } from "@/utils/ui/toast-utils";

export default function TaskTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all tasks (both templates and regular tasks)
        const allTasks = await taskApi.getTemplates();
        setTasks(allTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        ToastUtils.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTask = async (id: number) => {
    try {
      await taskApi.delete(id);
      setTasks(tasks.filter((task) => task.id !== id));
      ToastUtils.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      ToastUtils.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (template: Task) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Browse and create tasks for your agents to execute
          </p>
        </div>
        <Button asChild>
          <Link href="/templates/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2 mt-6">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="secondary" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24 mr-2" />
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4 mt-6">
          <p className="text-lg text-gray-500">
            {searchQuery ? "No matching tasks found" : "No tasks found"}
          </p>
          <Button asChild>
            <Link href="/templates/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Task
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{task.name}</CardTitle>
                  <div className="flex space-x-1">
                    {task.async_execution && (
                      <Badge variant="secondary">Async</Badge>
                    )}
                    {task.is_template && (
                      <Badge variant="outline">Template</Badge>
                    )}
                    {task.is_builtin && <Badge>Built-in</Badge>}
                  </div>
                </div>
                <CardDescription>
                  {task.description.substring(0, 100)}
                  {task.description.length > 100 ? "..." : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {task.tools && Object.keys(task.tools).length > 0 ? (
                    Object.keys(task.tools).map((tool) => (
                      <Badge key={tool} variant="outline">
                        {tool}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No tools configured
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openModal(task)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/templates/tasks/${task.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the task &quot;{task.name}
                        &quot;. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <TaskTemplateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          template={selectedTemplate}
        />
      )}
    </div>
  );
}
