import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateSection, updatePageTitle } from "@/store/slices/draftPageSlice";
import { setSelectedSection } from "@/store/slices/uiSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";

export default function StudioEditorPanel() {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector((s) => s.ui.selectedSectionId);
  const draftPage = useAppSelector((s) => s.draftPage.page);

  const selectedSection = draftPage?.sections.find((s) => s.id === selectedSectionId);
  const isPageDetails = selectedSectionId === "page-details";

  const handlePropChange = (sectionId: string, key: string, value: unknown) => {
    dispatch(updateSection({ sectionId, props: { [key]: value } }));
  };

  const handleClose = () => {
    dispatch(setSelectedSection(null));
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card w-[340px] z-20 shrink-0">
      <div className="flex h-16 items-center justify-between px-4 border-b border-border bg-card">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {isPageDetails ? "Page Settings" : "Section Settings"}
        </h3>
        {(selectedSection || isPageDetails) && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary" 
            onClick={handleClose}
            aria-label="Close editor panel"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isPageDetails && draftPage ? (
          <div className="space-y-4">
            <Field 
              label="Page Title" 
              value={draftPage.title} 
              onChange={(v) => dispatch(updatePageTitle(v))} 
            />
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Page URL Slug</Label>
              <Input 
                value={draftPage.slug} 
                disabled 
                className="rounded-lg border-border bg-secondary text-muted-foreground cursor-not-allowed h-10"
              />
              <span className="text-[10px] text-muted-foreground">The URL slug cannot be changed in this editor.</span>
            </div>
          </div>
        ) : selectedSection ? (
          renderEditorFields(selectedSection, handlePropChange)
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-48 px-4 border border-dashed rounded-xl border-border">
            <span className="text-sm font-semibold text-muted-foreground">No section selected</span>
            <span className="text-xs text-muted-foreground mt-1">
              Select a section or page settings from the structure panel to edit.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function renderEditorFields(
  section: { id: string; type: string; props: Record<string, unknown> },
  onChange: (sectionId: string, key: string, value: unknown) => void
) {
  const { id, type, props } = section;

  switch (type) {
    case "hero":
      return (
        <div className="space-y-4">
          <Field label="Hero Title" value={props.title as string} onChange={(v) => onChange(id, "title", v)} />
          <Field label="Subtitle Description" value={(props.subtitle as string) || ""} onChange={(v) => onChange(id, "subtitle", v)} multiline />
          <Field label="Primary Action Label" value={(props.ctaLabel as string) || ""} onChange={(v) => onChange(id, "ctaLabel", v)} />
          <Field label="Primary Action Link" value={(props.ctaUrl as string) || ""} onChange={(v) => onChange(id, "ctaUrl", v)} />
        </div>
      );
    case "cta":
      return (
        <div className="space-y-4">
          <Field label="Header Description" value={(props.description as string) || ""} onChange={(v) => onChange(id, "description", v)} multiline />
          <Field label="Primary Button Label" value={props.label as string} onChange={(v) => onChange(id, "label", v)} />
          <Field label="Button Redirect URL" value={props.url as string} onChange={(v) => onChange(id, "url", v)} />
        </div>
      );
    case "testimonial":
      return (
        <div className="space-y-4">
          <Field label="User Review Quote" value={props.quote as string} onChange={(v) => onChange(id, "quote", v)} multiline />
          <Field label="Author Name" value={props.author as string} onChange={(v) => onChange(id, "author", v)} />
          <Field label="Author Position / Role" value={(props.role as string) || ""} onChange={(v) => onChange(id, "role", v)} />
          <Field label="Company Affiliation" value={(props.company as string) || ""} onChange={(v) => onChange(id, "company", v)} />
        </div>
      );
    case "featureGrid": {
      const features = (props.features as Array<{ icon: string; title: string; description: string }>) || [];
      
      const handleFeatureChange = (index: number, key: string, val: string) => {
        const newFeatures = features.map((f, i) => 
          i === index ? { ...f, [key]: val } : f
        );
        onChange(id, "features", newFeatures);
      };

      const handleAddFeature = () => {
        const newFeatures = [
          ...features,
          { icon: "✨", title: "New Feature", description: "Feature description" }
        ];
        onChange(id, "features", newFeatures);
      };

      const handleRemoveFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        onChange(id, "features", newFeatures);
      };

      return (
        <div className="space-y-6">
          <Field label="Section Header Title" value={props.heading as string} onChange={(v) => onChange(id, "heading", v)} />
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Features ({features.length})
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddFeature}
                className="h-8 px-2.5 text-xs border border-border hover:bg-secondary text-foreground rounded-lg"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Feature
              </Button>
            </div>

            <div className="space-y-3 pr-1">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-3 border border-border rounded-xl bg-secondary space-y-2 relative group/feature"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground"># {index + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveFeature(index)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md"
                      disabled={features.length <= 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Icon</Label>
                      <Input 
                        value={feature.icon} 
                        onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
                        className="h-8 rounded-lg text-center mt-1 px-1 bg-card border-border focus-visible:ring-primary"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Title</Label>
                      <Input 
                        value={feature.title} 
                        onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                        className="h-8 rounded-lg mt-1 bg-card border-border focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Description</Label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                      className="flex min-h-[50px] w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary resize-y transition-all mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    default:
      return <p className="text-sm text-muted-foreground">No editable fields configured for this layout.</p>;
  }
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  const inputId = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {label}
      </Label>
      {multiline ? (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex min-h-[90px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all"
        />
      ) : (
        <Input 
          id={inputId} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="rounded-lg border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all h-10"
        />
      )}
    </div>
  );
}

