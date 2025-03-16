"use client";

import { useParams } from "next/navigation";
import CreateEditAgent from "../../create-edit-agent";

export default function EditAgentTemplatePage() {
  const params = useParams();
  // Ensure we have a valid string ID
  const id = typeof params.id === 'string' ? params.id : String(params.id);

  return <CreateEditAgent id={id} />;
}
