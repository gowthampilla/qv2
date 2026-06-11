"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import {
  addManualProgressFormAction,
  type AddWorkState
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: AddWorkState = {
  status: "idle",
  message: ""
};

export function AddWorkForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [editingAfterSave, setEditingAfterSave] = useState(false);
  const [state, formAction] = useFormState(
    addManualProgressFormAction,
    initialState
  );
  const saved = state.status === "success" && !editingAfterSave;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setEditingAfterSave(false);
      router.refresh();
    }
  }, [router, state.savedAt, state.status]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      <textarea
        className="form-textarea"
        name="progress"
        placeholder="I solved 2 LeetCode problems and studied Spring Boot."
        onChange={() => setEditingAfterSave(true)}
        required
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AddWorkSubmitButton saved={saved} />
        {state.status !== "idle" ? (
          <p
            className={cn(
              "rounded-xl border px-3 py-2 text-sm",
              state.status === "success"
                ? "border-[#2A2A2A] bg-[#050505] text-[#F5F5F5]"
                : "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5]"
            )}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function AddWorkSubmitButton({ saved }: { saved: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "w-fit",
        saved &&
          "border-[#2A2A2A] bg-[#050505] text-[#F5F5F5] shadow-none hover:bg-[#050505]"
      )}
    >
      <Plus className="mr-2 h-4 w-4" />
      {pending ? "Saving..." : saved ? "Saved - add another" : "Save progress"}
    </Button>
  );
}
