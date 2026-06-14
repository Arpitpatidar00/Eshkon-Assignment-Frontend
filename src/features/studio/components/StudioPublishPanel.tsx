/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPublish, startPublish, publishSuccess, publishError } from "@/store/slices/publishSlice";
import { setPage } from "@/store/slices/draftPageSlice";
import { showToast } from "@/store/slices/uiSlice";
import { apiClient } from "@/lib/apiClient";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

interface StudioPublishPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function StudioPublishPanel({ open, onClose }: StudioPublishPanelProps) {
  const dispatch = useAppDispatch();
  const publishState = useAppSelector((s) => s.publish);
  const draftPage = useAppSelector((s) => s.draftPage.page);

  if (!draftPage) return null;

  const handlePublish = async () => {
    dispatch(startPublish());
    try {
      const data = await apiClient<{ version: string; changelog: string; error?: string }>("/publish", {
        method: "POST",
        body: JSON.stringify({ page: draftPage }),
      });

      dispatch(publishSuccess({ version: data.version, changelog: data.changelog }));
      dispatch(showToast({ message: `Published v${data.version}!`, type: "success" }));
      localStorage.removeItem(`draft-${draftPage.slug}`);
      dispatch(setPage(draftPage));
      onClose();
    } catch (err: any) {
      dispatch(publishError(err.message || "Network error"));
    }
  };

  const handleClose = () => {
    onClose();
    dispatch(resetPublish());
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">Release Version</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Confirm and build the static landing page with the current draft configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 items-center justify-center rounded-xl bg-secondary p-4 border border-border">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current</span>
              <span className="font-semibold text-sm text-foreground">
                {publishState.currentVersion ? `v${publishState.currentVersion}` : "None"}
              </span>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Release</span>
              <span className="font-extrabold text-base text-primary">
                v{publishState.newVersion}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-border pb-2">
              <span className="font-semibold text-muted-foreground">Auto SemVer Bump Type</span>
              {publishState.bump && (
                <span className="capitalize font-bold text-xs px-2.5 py-0.5 rounded bg-accent text-primary border border-primary/25">
                  {publishState.bump} bump
                </span>
              )}
            </div>

            {publishState.changelog && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Changelog Logs</span>
                <pre className="max-h-36 overflow-y-auto rounded-lg border border-border bg-secondary text-foreground p-4 text-xs font-mono leading-relaxed">
                  {publishState.changelog}
                </pre>
              </div>
            )}

            {publishState.error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive font-medium">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span>{publishState.error}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="rounded-lg border-border hover:bg-secondary text-foreground"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={publishState.status === "publishing"}
            className="bg-primary hover:bg-primary/95 text-white font-semibold shadow-sm rounded-lg"
          >
            {publishState.status === "publishing" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {publishState.status === "publishing" ? "Releasing..." : "Confirm & Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

