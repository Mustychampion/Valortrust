import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Upload, FileText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Certificate {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  fileName?: string;
}

export function CertificatesManager() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    year: "",
    description: "",
    fileName: "",
  });

  const resetForm = () => {
    setFormData({ title: "", organization: "", year: "", description: "", fileName: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, DOCX, images, or ZIP files only.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.organization || !formData.year) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCert: Certificate = {
      id: Date.now().toString(),
      ...formData,
    };

    setCertificates(prev => [...prev, newCert]);
    toast({ title: "Certificate Added", description: `${formData.title} has been added.` });
    resetForm();
    setIsLoading(false);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      organization: cert.organization,
      year: cert.year,
      description: cert.description,
      fileName: cert.fileName || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCertificates(prev =>
      prev.map(c =>
        c.id === editingId ? { ...c, ...formData } : c
      )
    );

    toast({ title: "Certificate Updated", description: "Changes have been saved." });
    resetForm();
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
    toast({ title: "Certificate Deleted", description: "The certificate has been removed." });
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId ? "Edit Certificate" : "Add New Certificate"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Certificate Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Professional QS Certificate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Issuing Organization *
              </label>
              <Input
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g., NIQS"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Year *
              </label>
              <Input
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="e.g., 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload File
              </label>
              <div className="relative">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                  className="hidden"
                  id="cert-file"
                />
                <label
                  htmlFor="cert-file"
                  className="flex items-center gap-2 px-4 py-2 border border-input rounded-md bg-background cursor-pointer hover:bg-muted transition-colors"
                >
                  <Upload size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.fileName || "Choose file..."}
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the certification..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={editingId ? handleUpdate : handleAdd} disabled={isLoading}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingId ? "Update" : "Add"} Certificate
            </Button>
            <Button variant="outline" onClick={resetForm}>
              <X size={16} />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={16} />
          Add New Certificate
        </Button>
      )}

      {/* Certificates List */}
      {certificates.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-card rounded-xl overflow-hidden card-shadow group">
              <div className="hero-gradient p-4">
                <Award size={24} className="text-primary-foreground" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{cert.title}</h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{cert.organization} • {cert.year}</p>
                {cert.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cert.description}</p>
                )}
                {cert.fileName && (
                  <div className="flex items-center gap-2 mt-3 text-primary text-sm">
                    <FileText size={14} />
                    {cert.fileName}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-12 card-shadow text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <Award size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No Certificates Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Upload your professional certificates and achievements to build credibility.
          </p>
        </div>
      )}
    </div>
  );
}
