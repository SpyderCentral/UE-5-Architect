
import { SavedProject } from '../types';

const LS_KEY = 'ue5_architect_projects';

/**
 * Retrieves all saved projects from LocalStorage.
 */
export const getSavedProjects = (): SavedProject[] => {
  const data = localStorage.getItem(LS_KEY);
  if (!data) return [];
  try {
    const projects = JSON.parse(data) as SavedProject[];
    // Sort by last modified date descending (newest first)
    return projects.sort((a, b) => b.lastModified - a.lastModified);
  } catch (e) {
    console.error("Failed to parse projects from localStorage", e);
    return [];
  }
};

/**
 * Saves or updates a project in LocalStorage.
 * If storage is full, it deletes the oldest project(s) and tries again.
 */
export const saveProjectToStorage = (project: SavedProject): void => {
  try {
    const projects = getSavedProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = { ...project, lastModified: Date.now() };
    } else {
      projects.push({ ...project, lastModified: Date.now() });
    }
    
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(projects));
    } catch (quotaError) {
        if (quotaError instanceof DOMException && (quotaError.name === 'QuotaExceededError' || quotaError.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            console.warn("LocalStorage full, pruning oldest projects...");
            // Remove the oldest project (at the end of the sorted array)
            if (projects.length > 1) {
                projects.sort((a, b) => a.lastModified - b.lastModified); // Sort oldest first
                projects.shift(); // Remove oldest
                localStorage.setItem(LS_KEY, JSON.stringify(projects));
                // Recursive call after pruning
                saveProjectToStorage(project);
            } else {
                console.error("Single project too large for LocalStorage quota.");
            }
        } else {
            throw quotaError;
        }
    }
  } catch (e) {
    console.error("Failed to save project to localStorage.", e);
  }
};

/**
 * Deletes a project from LocalStorage.
 */
export const deleteProjectFromStorage = (id: string): void => {
  try {
    const projects = getSavedProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete project from localStorage", e);
  }
};

/**
 * Finds a specific project by its unique ID.
 */
export const getProjectById = (id: string): SavedProject | undefined => {
  const projects = getSavedProjects();
  return projects.find(p => p.id === id);
};
