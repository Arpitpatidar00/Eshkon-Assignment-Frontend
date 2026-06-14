"use client";

import { useEffect, useState } from "react";
import type { Page, Role } from "@/domain/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPage } from "@/store/slices/draftPageSlice";
import { clearToast, setPreviewMode } from "@/store/slices/uiSlice";
import PageRenderer from "@/components/renderer/PageRenderer";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

// Feature Components
import StudioSidebar from "@/features/studio/components/StudioSidebar";
import StudioToolbar from "@/features/studio/components/StudioToolbar";
import StudioPublishPanel from "@/features/studio/components/StudioPublishPanel";
import StudioEditorPanel from "@/features/studio/components/StudioEditorPanel";

interface StudioEditorProps {
  initialPage: Page;
  userRole: Role;
}

export default function StudioEditor({ initialPage, userRole }: StudioEditorProps) {
  const dispatch = useAppDispatch();
  const draftPage = useAppSelector((s) => s.draftPage.page);
  const isDirty = useAppSelector((s) => s.draftPage.isDirty);
  const toastMessage = useAppSelector((s) => s.ui.toastMessage);
  const toastType = useAppSelector((s) => s.ui.toastType);
  const { toast } = useToast();

  const [showPublishPanel, setShowPublishPanel] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"sections" | "editor" | "preview">("sections");

  // Initialize and persist state
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft-${initialPage.slug}`);
    if (savedDraft) {
      try {
        dispatch(setPage(JSON.parse(savedDraft)));
        return;
      } catch {
        // Corrupted cache
      }
    }
    dispatch(setPage(initialPage));
  }, [initialPage, dispatch]);

  useEffect(() => {
    if (draftPage && isDirty) {
      localStorage.setItem(`draft-${draftPage.slug}`, JSON.stringify(draftPage));
    }
  }, [draftPage, isDirty]);

  // Bridge Redux toasts to Shadcn toast
  useEffect(() => {
    if (toastMessage) {
      toast({
        title: toastType === "success" ? "Success" : toastType === "error" ? "Error" : "Info",
        description: toastMessage,
        variant: toastType === "error" ? "destructive" : "default",
      });
      const timeout = setTimeout(() => dispatch(clearToast()), 500);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage, toastType, toast, dispatch]);

  const previewMode = useAppSelector((s) => s.ui.previewMode);

  if (!draftPage) return null;

  return (
    <div className="flex h-screen overflow-hidden flex-col bg-background text-foreground">
      {!previewMode && (
        <StudioToolbar
          userRole={userRole}
          onPublishClick={() => setShowPublishPanel(true)}
        />
      )}

      {/* Mobile Tab Bar */}
      {!previewMode && (
        <div className="flex border-b border-border bg-card lg:hidden shrink-0">
          <button
            onClick={() => setActiveMobileTab("sections")}
            className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all ${
              activeMobileTab === "sections"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Structure
          </button>
          <button
            onClick={() => setActiveMobileTab("editor")}
            className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all ${
              activeMobileTab === "editor"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveMobileTab("preview")}
            className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all ${
              activeMobileTab === "preview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Panel 1: Section List */}
        {!previewMode && (
          <div className={cn("h-full shrink-0", activeMobileTab === "sections" ? "block w-full lg:w-auto" : "hidden lg:block")}>
            <StudioSidebar />
          </div>
        )}

        {/* Panel 2: Editor Panel */}
        {!previewMode && (
          <div className={cn("h-full shrink-0", activeMobileTab === "editor" ? "block w-full lg:w-auto" : "hidden lg:block")}>
            <StudioEditorPanel />
          </div>
        )}

        {/* Panel 3: Live Preview */}
        <div className={cn("flex-1 h-full overflow-hidden flex flex-col", (previewMode || activeMobileTab === "preview") ? "flex" : "hidden lg:flex")}>
          <div className="flex-1 overflow-auto bg-secondary">
            <PageRenderer page={draftPage} />
          </div>
        </div>
      </div>

      {previewMode && (
        <button
          onClick={() => dispatch(setPreviewMode(false))}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/95 transition-all active:scale-95"
        >
          <Pencil className="h-4 w-4" />
          Edit Page
        </button>
      )}

      <StudioPublishPanel
        open={showPublishPanel}
        onClose={() => setShowPublishPanel(false)}
      />

      <Toaster />
    </div>
  );
}

