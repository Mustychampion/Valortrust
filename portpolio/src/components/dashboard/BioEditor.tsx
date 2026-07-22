import { useState, useEffect, useCallback } from "react";
import { Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBio, useUpdateBio } from "@/hooks/useBio";

export function BioEditor() {
  const { data: bioData, isLoading: isLoadingBio } = useBio();
  const updateBio = useUpdateBio();
  
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [localBio, setLocalBio] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local bio when data loads
  useEffect(() => {
    if (bioData?.content && !hasChanges) {
      setLocalBio(bioData.content);
    }
  }, [bioData, hasChanges]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!bioData?.id || !hasChanges) return;
    
    setAutoSaveStatus("saving");
    updateBio.mutate(
      { id: bioData.id, content: localBio },
      {
        onSuccess: () => {
          setAutoSaveStatus("saved");
          setHasChanges(false);
          setTimeout(() => setAutoSaveStatus("idle"), 2000);
        },
        onError: () => {
          setAutoSaveStatus("idle");
        }
      }
    );
  }, [bioData?.id, localBio, hasChanges, updateBio]);

  // Debounced auto-save
  useEffect(() => {
    if (!hasChanges) return;
    
    const timer = setTimeout(() => {
      if (localBio.trim()) {
        autoSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [localBio, hasChanges, autoSave]);

  const handleBioChange = (value: string) => {
    setLocalBio(value);
    setHasChanges(true);
  };

  const handleManualSave = () => {
    if (!bioData?.id) return;
    updateBio.mutate({ id: bioData.id, content: localBio }, {
      onSuccess: () => setHasChanges(false)
    });
  };

  if (isLoadingBio) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-card rounded-2xl p-6 lg:p-8 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-semibold text-xl text-foreground">
              CEO Statement / Bio
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Write your professional summary that appears on your portfolio
            </p>
          </div>
          {autoSaveStatus !== "idle" && (
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === "saving" && (
                <>
                  <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Saving...</span>
                </>
              )}
              {autoSaveStatus === "saved" && (
                <>
                  <Check size={14} className="text-primary" />
                  <span className="text-primary">Auto-saved</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Textarea
            value={localBio}
            onChange={(e) => handleBioChange(e.target.value)}
            placeholder="Write your professional summary here..."
            rows={12}
            className="resize-none text-base leading-relaxed"
          />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{localBio.length} characters</span>
            <span>Changes auto-save after 2 seconds</span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium text-foreground text-sm mb-2">Writing Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Keep it professional and concise (2-3 paragraphs ideal)</li>
            <li>• Highlight your unique value proposition</li>
            <li>• Mention key achievements and expertise areas</li>
            <li>• Include your professional goals and vision</li>
          </ul>
        </div>

        {/* Manual Save */}
        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <Button onClick={handleManualSave} disabled={updateBio.isPending || !hasChanges}>
            {updateBio.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
