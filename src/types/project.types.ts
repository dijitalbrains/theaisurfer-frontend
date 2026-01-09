export interface Project {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  allowedRedirectUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProject {
  hasAccess: boolean;
  project: Project;
}
