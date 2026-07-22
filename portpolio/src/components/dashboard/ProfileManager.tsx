import { useState, useEffect } from "react";
import { Camera, Save, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile, useUploadProfileImage, OWNER_FULL_NAME } from "@/hooks/useProfile";

export function ProfileManager() {
  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadImage = useUploadProfileImage();
  
  const [formData, setFormData] = useState({
    roles: "",
    tagline: "",
    location: "",
    phone: "",
    email: "",
  });

  // Sync form data with profile from database
  useEffect(() => {
    if (profile) {
      setFormData({
        roles: profile.roles || "",
        tagline: profile.tagline || "",
        location: profile.location || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadImage.mutateAsync(file);
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-card rounded-2xl p-6 lg:p-8 card-shadow">
        <h2 className="font-display font-semibold text-xl text-foreground mb-6">
          Profile Information
        </h2>

        {/* Profile Photo */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-muted overflow-hidden flex items-center justify-center">
              {profile?.profile_image_url ? (
                <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-muted-foreground" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
              {uploadImage.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Camera size={14} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadImage.isPending}
              />
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Profile Photo</h3>
            <p className="text-sm text-muted-foreground">
              Upload a professional photo (max 5MB)
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                value={OWNER_FULL_NAME}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Name cannot be changed
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Roles / Titles
            </label>
            <Input
              name="roles"
              value={formData.roles}
              onChange={handleChange}
              placeholder="e.g., CEO, Quantity Surveyor"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple roles with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tagline
            </label>
            <Input
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="A short professional tagline"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
