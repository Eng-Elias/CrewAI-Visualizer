"use client";

import { use } from "react";
import { CreateEditCrew } from "@/app/(authenticated)/templates/crews/create-edit-crew";

interface EditCrewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCrewPage({ params }: EditCrewPageProps) {
  const resolvedParams = use(params);
  const crewId = parseInt(resolvedParams.id);

  return <CreateEditCrew crewId={crewId} isTemplate={true} />;
}
