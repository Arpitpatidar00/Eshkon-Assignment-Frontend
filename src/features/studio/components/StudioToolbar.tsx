import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPreviewMode, toggleSidebar, showToast } from "@/store/slices/uiSlice";
import { resetDraft, setPage, updatePageTitle } from "@/store/slices/draftPageSlice";
import { setPublishPreview } from "@/store/slices/publishSlice";
import { apiClient } from "@/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Page, Role } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, PanelLeft, RotateCcw, Upload, LogOut, Save, RefreshCw } from "lucide-react";

interface StudioToolbarProps {
  userRole: Role;
  onPublishClick: () => void;
}

export default function StudioToolbar({ userRole, onPublishClick }: StudioToolbarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const draftPage = useAppSelector((s) => s.draftPage.page);
  const isDirty = useAppSelector((s) => s.draftPage.isDirty);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const previewMode = useAppSelector((s) => s.ui.previewMode);

  if (!draftPage) return null;

  const handleSaveDraft = async () => {
    try {
      const data = await apiClient<{ page: Page }>(`/pages/${draftPage.slug}`, {
        method: "PUT",
        body: JSON.stringify({ page: draftPage }),
      });
      dispatch(setPage(data.page));
      localStorage.removeItem(`draft-${draftPage.slug}`);
      dispatch(showToast({ message: "Draft saved successfully", type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.message || "Failed to save draft", type: "error" }));
    }
  };

  const handleResetDraft = () => {
    dispatch(resetDraft());
    localStorage.removeItem(`draft-${draftPage.slug}`);
    dispatch(showToast({ message: "Draft reset to original", type: "info" }));
  };

  const handlePreviewPublish = async () => {
    try {
      if (isDirty) {
        await apiClient<{ page: Page }>(`/pages/${draftPage.slug}`, {
          method: "PUT",
          body: JSON.stringify({ page: draftPage }),
        });
        dispatch(setPage(draftPage));
        localStorage.removeItem(`draft-${draftPage.slug}`);
      }

      const data = await apiClient<any>(`/publish/preview?slug=${draftPage.slug}`);
      
      if (data.bump === "none") {
        dispatch(showToast({ message: "No changes to publish — draft matches the latest release.", type: "info" }));
        return;
      }

      dispatch(setPublishPreview(data));
      onPublishClick();
    } catch (err: any) {
      dispatch(showToast({ message: err.message || "Failed to preview publish", type: "error" }));
    }
  };

  const handleRefreshDraft = async () => {
    try {
      const data = await apiClient<{ page: Page }>(`/pages/${draftPage.slug}`);
      dispatch(setPage(data.page));
      localStorage.removeItem(`draft-${draftPage.slug}`);
      dispatch(showToast({ message: "Draft updated to latest version from server", type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.message || "Failed to fetch latest draft", type: "error" }));
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6 sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground" 
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Open sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Link 
            href={`/preview/${draftPage.slug}`} 
            className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors animate-fade-in"
          >
            Page Studio
          </Link>
          <span className="text-border select-none">/</span>
          <input
            type="text"
            value={draftPage.title}
            onChange={(e) => dispatch(updatePageTitle(e.target.value))}
            className="bg-transparent text-sm font-semibold text-foreground hover:bg-secondary/60 focus:bg-background border border-transparent hover:border-border/60 focus:border-primary rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary/45 transition-all w-36 sm:w-60 truncate"
            aria-label="Edit page title"
          />
        </div>

        {/* Pulsing Sync/Dirty status dot */}
        <div className="hidden sm:block">
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Unsaved Changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              Saved
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={previewMode ? "secondary" : "outline"}
          size="sm"
          onClick={() => dispatch(setPreviewMode(!previewMode))}
          className="h-9 border-border text-foreground hover:bg-secondary"
        >
          {previewMode ? <Pencil className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {previewMode ? "Edit Mode" : "Preview Mode"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshDraft}
          className="h-9 border-border text-foreground hover:bg-secondary"
          title="Pull latest draft from server"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        {isDirty && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveDraft}
              className="h-9 border-border hover:bg-secondary text-foreground font-semibold"
            >
              <Save className="mr-2 h-4 w-4 text-primary" />
              Save Draft
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetDraft}
              className="h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </>
        )}

        {userRole === "publisher" && (
          <Button
            size="sm"
            onClick={handlePreviewPublish}
            className="h-9 bg-primary hover:bg-primary/95 text-white font-semibold shadow-sm transition-colors rounded-lg"
          >
            <Upload className="mr-2 h-4 w-4" />
            Publish
          </Button>
        )}

        <div className="h-4 w-[1px] bg-border mx-1 hidden xs:block" />

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="h-9 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 xs:mr-2" />
          <span className="hidden xs:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

