import { useState } from "react";
import { Upload, Download, Trash2, FileArchive, Link2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PortfolioFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  downloadUrl: string;
}

export function PortfolioManager() {
  const { toast } = useToast();
  const [files, setFiles] = useState<PortfolioFile[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      const newFile: PortfolioFile = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleDateString(),
        downloadUrl: `#download-${Date.now()}`,
      };

      setFiles(prev => [...prev, newFile]);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({
      title: "File Deleted",
      description: "The file has been removed.",
    });
  };

  const handleCopyLink = (file: PortfolioFile) => {
    navigator.clipboard.writeText(`https://mustaphasani.com/download/${file.id}`);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Link Copied",
      description: "Download link copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-card rounded-2xl p-8 card-shadow">
        <h3 className="font-semibold text-foreground mb-4">Upload Portfolio Files</h3>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
          <Input
            type="file"
            onChange={handleFileUpload}
            accept=".zip,.pdf,.rar"
            className="hidden"
            id="portfolio-upload"
          />
          <label htmlFor="portfolio-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload size={28} className="text-primary" />
            </div>
            <p className="text-foreground font-medium mb-1">Click to upload portfolio files</p>
            <p className="text-muted-foreground text-sm">
              ZIP, PDF, or RAR files up to 50MB
            </p>
          </label>
        </div>
      </div>

      {/* CV/Resume Quick Upload */}
      <div className="bg-card rounded-2xl p-6 card-shadow">
        <h3 className="font-semibold text-foreground mb-4">CV / Resume</h3>
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileArchive size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Upload your latest CV</p>
              <p className="text-muted-foreground text-xs">This will appear on the download button</p>
            </div>
          </div>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="cv-upload"
          />
          <label htmlFor="cv-upload">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload size={14} />
                Upload CV
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 ? (
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileArchive size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{file.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {file.size} • Uploaded {file.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyLink(file)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === file.id ? (
                      <Check size={14} className="text-primary" />
                    ) : (
                      <Link2 size={14} />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-12 card-shadow text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <FileArchive size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No Files Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Upload your portfolio ZIP files or documents for visitors to download.
          </p>
        </div>
      )}
    </div>
  );
}
