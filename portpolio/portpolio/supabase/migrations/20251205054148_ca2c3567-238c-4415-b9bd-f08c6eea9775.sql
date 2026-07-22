-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  roles TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  location TEXT DEFAULT '',
  profile_image_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create bio/CEO statement table
CREATE TABLE public.site_bio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.site_bio ENABLE ROW LEVEL SECURITY;

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT DEFAULT '',
  year TEXT DEFAULT '',
  description TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  file_type TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  tools TEXT DEFAULT '',
  description TEXT DEFAULT '',
  impact TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create visitor_analytics table (numeric only, no PII)
CREATE TABLE public.visitor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  visit_count INTEGER DEFAULT 1,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Create login_attempts table for rate limiting
CREATE TABLE public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT DEFAULT '',
  success BOOLEAN DEFAULT false,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Create portfolio_files table
CREATE TABLE public.portfolio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT '',
  file_size BIGINT DEFAULT 0,
  is_cv BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_files ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_bio_updated_at BEFORE UPDATE ON public.site_bio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles (admin only)
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- RLS Policies for profiles
CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for site_bio (public read, admin write)
CREATE POLICY "Public can view bio" ON public.site_bio
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage bio" ON public.site_bio
  FOR ALL USING (public.is_admin());

-- RLS Policies for skills (public read, admin write)
CREATE POLICY "Public can view skills" ON public.skills
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON public.skills
  FOR ALL USING (public.is_admin());

-- RLS Policies for certificates (public read, admin write)
CREATE POLICY "Public can view certificates" ON public.certificates
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage certificates" ON public.certificates
  FOR ALL USING (public.is_admin());

-- RLS Policies for projects (public read, admin write)
CREATE POLICY "Public can view projects" ON public.projects
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- RLS Policies for contact_submissions (public insert, admin read)
CREATE POLICY "Public can submit contacts" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contacts" ON public.contact_submissions
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage contacts" ON public.contact_submissions
  FOR ALL USING (public.is_admin());

-- RLS Policies for visitor_analytics (public insert for tracking, admin read)
CREATE POLICY "Public can log visits" ON public.visitor_analytics
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON public.visitor_analytics
  FOR SELECT USING (public.is_admin());

-- RLS Policies for login_attempts (system use only)
CREATE POLICY "System can log attempts" ON public.login_attempts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view attempts" ON public.login_attempts
  FOR SELECT USING (public.is_admin());

-- RLS Policies for portfolio_files (public read for downloads, admin write)
CREATE POLICY "Public can view portfolio files" ON public.portfolio_files
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage portfolio files" ON public.portfolio_files
  FOR ALL USING (public.is_admin());

-- Function to handle new user signup (creates profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default bio
INSERT INTO public.site_bio (content) VALUES (
  'I am Mustapha Sani Jibril — CEO of ValorTrust Solution & Consultant Nig. Ltd and a Quantity Surveying student at Bayero University Kano. I combine engineering discipline and commercial thinking to deliver cost-conscious construction solutions and practical digital strategies. My focus areas include Data Analytics, Marketing Strategy, Small Business Consulting, Product Strategy, and Marketing Campaigns. I help businesses optimize costs, scale digital presence, and translate technical projects into measurable impact.'
);

-- Insert default skills
INSERT INTO public.skills (name, description, category, display_order) VALUES
  ('Data Analytics', 'Turn raw project and operational data into actionable insights: cost trends, productivity metrics, and reporting that guides decisions.', 'Data & Analysis', 1),
  ('Marketing Strategy', 'Design measurable strategies to grow digital presence, lead generation, and customer retention for construction and small business services.', 'Marketing', 2),
  ('Small Business Consulting', 'Practical, budget-aware consulting to optimize operations, pricing, and market fit for local SMEs.', 'Consulting', 3),
  ('Product Strategy', 'Roadmap and feature prioritization to transform service ideas into repeatable products and revenue streams.', 'Strategy', 4),
  ('Marketing Campaigns', 'Plan and execute campaigns across social and digital channels to attract clients and build brand trust.', 'Marketing', 5);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-images', 'profile-images', true),
  ('certificates', 'certificates', true),
  ('project-images', 'project-images', true),
  ('portfolio-files', 'portfolio-files', true);

-- Storage policies for profile-images
CREATE POLICY "Public can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Admins can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND public.is_admin());
CREATE POLICY "Admins can update profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images' AND public.is_admin());
CREATE POLICY "Admins can delete profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-images' AND public.is_admin());

-- Storage policies for certificates
CREATE POLICY "Public can view certificates" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Admins can upload certificates" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'certificates' AND public.is_admin());
CREATE POLICY "Admins can update certificates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'certificates' AND public.is_admin());
CREATE POLICY "Admins can delete certificates" ON storage.objects
  FOR DELETE USING (bucket_id = 'certificates' AND public.is_admin());

-- Storage policies for project-images
CREATE POLICY "Public can view project images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Admins can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "Admins can update project images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "Admins can delete project images" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-images' AND public.is_admin());

-- Storage policies for portfolio-files
CREATE POLICY "Public can view portfolio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-files');
CREATE POLICY "Admins can upload portfolio files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-files' AND public.is_admin());
CREATE POLICY "Admins can update portfolio files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-files' AND public.is_admin());
CREATE POLICY "Admins can delete portfolio files" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-files' AND public.is_admin());