import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedSection, toggleSidebar } from "@/store/slices/uiSlice";
import { reorderSections, removeSection, addSection } from "@/store/slices/draftPageSlice";
import { v4 as uuidv4 } from "uuid";
import type { SectionType } from "@/domain/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  PanelLeftClose, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus, 
  Target, 
  LayoutGrid, 
  MessageSquare, 
  Rocket,
  Layers
} from "lucide-react";

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero: <Target className="h-4 w-4" />,
  featureGrid: <LayoutGrid className="h-4 w-4" />,
  testimonial: <MessageSquare className="h-4 w-4" />,
  cta: <Rocket className="h-4 w-4" />,
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  featureGrid: "Feature Grid",
  testimonial: "Testimonial",
  cta: "Call to Action",
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: "Intro banner with title & CTA button",
  featureGrid: "Grid showing list of product key features",
  testimonial: "Customer review quote & rating stars",
  cta: "Footer card encouraging final conversions",
};

const SECTION_DEFAULTS: Record<SectionType, Record<string, unknown>> = {
  hero: { title: "New Hero Section", subtitle: "Add your subtitle here" },
  featureGrid: {
    heading: "Features",
    features: [{ icon: "⭐", title: "Feature 1", description: "Description here" }],
  },
  testimonial: {
    quote: "Add your testimonial quote here",
    author: "Author Name",
    role: "Role",
    company: "Company",
    rating: 5,
  },
  cta: {
    label: "Click Here",
    url: "/action",
    description: "Add a call to action",
    variant: "primary",
  },
};

export default function StudioSidebar() {
  const dispatch = useAppDispatch();
  const draftPage = useAppSelector((s) => s.draftPage.page);
  const selectedSectionId = useAppSelector((s) => s.ui.selectedSectionId);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  const [showAddDialog, setShowAddDialog] = useState(false);

  if (!draftPage) return null;

  const handleSectionSelect = (id: string) => {
    dispatch(setSelectedSection(id === selectedSectionId ? null : id));
  };

  const handleMoveSection = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    dispatch(reorderSections({ fromIndex, toIndex }));
  };

  const handleRemoveSection = (id: string) => {
    dispatch(removeSection(id));
    if (selectedSectionId === id) dispatch(setSelectedSection(null));
  };

  const handleAddSection = (type: SectionType) => {
    const id = `${type}-${uuidv4().slice(0, 8)}`;
    dispatch(addSection({ id, type, props: SECTION_DEFAULTS[type] }));
    setShowAddDialog(false);
    dispatch(setSelectedSection(id));
  };

  return (
    <>
      <aside
        className={cn(
          "flex h-full w-72 flex-col border-r border-border bg-secondary transition-all duration-300 relative z-30",
          !sidebarOpen && "w-0 overflow-hidden border-r-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-card">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold tracking-tight text-foreground">Page Structure</span>
            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-primary">
              {draftPage.sections.length}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground" 
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div
            className={cn(
              "group flex flex-col rounded-xl border p-1 cursor-pointer transition-all duration-200 bg-card",
              selectedSectionId === "page-details"
                ? "border-primary bg-card shadow-sm ring-1 ring-primary"
                : "border-border hover:border-primary/50 hover:shadow-sm"
            )}
            onClick={() => dispatch(setSelectedSection(selectedSectionId === "page-details" ? null : "page-details"))}
          >
            <div className="flex items-center gap-2 px-2 py-2">
              <span className={cn(
                "transition-colors",
                selectedSectionId === "page-details" ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                <Layers className="h-4 w-4" />
              </span>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-foreground truncate">
                  Page Settings
                </div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">Title and metadata</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1 py-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sections</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          {draftPage.sections.map((section, index) => {
            const isSelected = selectedSectionId === section.id;
            return (
              <div
                key={section.id}
                className={cn(
                  "group flex flex-col rounded-xl border p-1 cursor-pointer transition-all duration-200 bg-card",
                  isSelected
                    ? "border-primary bg-card shadow-sm ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:shadow-sm"
                )}
                onClick={() => handleSectionSelect(section.id)}
              >
                <div className="flex items-center gap-2 px-2 py-2">
                  <span className={cn(
                    "transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {SECTION_ICONS[section.type] || <LayoutGrid className="h-4 w-4" />}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-foreground truncate">
                      {SECTION_LABELS[section.type] || section.type}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate mt-0.5">{section.id}</div>
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:bg-secondary hover:text-foreground" 
                      onClick={(e) => { e.stopPropagation(); handleMoveSection(index, "up"); }} 
                      disabled={index === 0}
                      aria-label="Move section up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:bg-secondary hover:text-foreground" 
                      onClick={(e) => { e.stopPropagation(); handleMoveSection(index, "down"); }} 
                      disabled={index === draftPage.sections.length - 1}
                      aria-label="Move section down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" 
                      onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }}
                      aria-label="Remove section"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {draftPage.sections.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed rounded-xl border-border">
              <span className="text-sm font-semibold text-muted-foreground">No sections added</span>
              <span className="text-xs text-muted-foreground mt-1 max-w-[160px]">Add sections to design your landing page.</span>
            </div>
          )}
        </div>

        {/* Add Section Button */}
        <div className="border-t border-border p-4 bg-card">
          <Button 
            className="w-full bg-primary hover:bg-primary/95 text-white font-semibold shadow-sm rounded-lg py-5" 
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Section
          </Button>
        </div>
      </aside>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-card p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">Add Layout Section</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3.5 py-4">
            {(Object.keys(SECTION_DEFAULTS) as SectionType[]).map((type) => (
              <button
                key={type}
                className="group flex items-start gap-4 rounded-xl border border-border p-4 text-left transition-all duration-200 hover:bg-secondary hover:border-primary/50 hover:shadow-sm"
                onClick={() => handleAddSection(type)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  {SECTION_ICONS[type]}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {SECTION_LABELS[type] || type}
                  </div>
                  <div className="text-xs text-muted-foreground leading-normal">
                    {SECTION_DESCRIPTIONS[type]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

