import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Upload, Image, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  role: string;
  tools: string;
  description: string;
  impact: string;
  imageUrl?: string;
}

export function ProjectsManager() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    tools: "",
    description: "",
    impact: "",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({ name: "", role: "", tools: "", description: "", impact: "", imageUrl: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload images smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.role || !formData.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newProject: Project = {
      id: Date.now().toString(),
      ...formData,
    };

    setProjects(prev => [...prev, newProject]);
    toast({ title: "Project Added", description: `${formData.name} has been added.` });
    resetForm();
    setIsLoading(false);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      role: project.role,
      tools: project.tools,
      description: project.description,
      impact: project.impact,
      imageUrl: project.imageUrl || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setProjects(prev =>
      prev.map(p =>
        p.id === editingId ? { ...p, ...formData } : p
      )
    );

    toast({ title: "Project Updated", description: "Changes have been saved." });
    resetForm();
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: "Project Deleted", description: "The project has been removed." });
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-card rounded-2xl p-6 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId ? "Edit Project" : "Add New Project"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Commercial Building Cost Analysis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Role *
              </label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Lead Quantity Surveyor"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Tools Used
            </label>
            <Input
              value={formData.tools}
              onChange={(e) => setFormData(prev => ({ ...prev, tools: e.target.value }))}
              placeholder="e.g., AutoCAD, Excel, CostX (comma separated)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the project scope, objectives, and your contributions..."
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Impact / Results
            </label>
            <Input
              value={formData.impact}
              onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
              placeholder="e.g., Saved client 15% on construction costs"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Preview Image
            </label>
            <div className="flex items-center gap-4">
              {formData.imageUrl ? (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                  <Image size={24} className="text-muted-foreground" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="project-image"
                />
                <label htmlFor="project-image">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload size={14} />
                      Upload Image
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={editingId ? handleUpdate : handleAdd} disabled={isLoading}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingId ? "Update" : "Add"} Project
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
          Add New Project
        </Button>
      )}

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-card rounded-xl overflow-hidden card-shadow group">
              <div className="aspect-video bg-muted relative">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full hero-gradient flex items-center justify-center">
                    <FolderKanban size={32} className="text-primary-foreground/50" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{project.name}</h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-primary mb-2">{project.role}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                {project.tools && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.tools.split(',').map((tool, i) => (
                      <span key={i} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded">
                        {tool.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-12 card-shadow text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <FolderKanban size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Showcase your best work by adding projects with descriptions and images.
          </p>
        </div>
      )}
    </div>
  );
}
