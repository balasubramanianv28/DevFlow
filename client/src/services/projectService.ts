import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

export interface Project {
    _id: string;
    name: string;
    description: string;
    status: "planning" | "active" | "completed" | "archived";
    priority: "low" | "medium" | "high";
    startDate: string | null;
    dueDate: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

export const getProjects = async (): Promise<Project[]> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        return [];
    }

    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.projects;
};

export const updateProject = async (
    projectId: string,
    projectData: {
        name?: string;
        description?: string;
        status?: "planning" | "active" | "completed" | "archived";
        priority?: "low" | "medium" | "high";
        startDate?: string | null;
        dueDate?: string | null;
    }
): Promise<Project> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    const response = await axios.patch(
        `${API_URL}/${projectId}`,
        projectData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.project;
};

export const deleteProject = async (
    projectId: string
): Promise<void> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    await axios.delete(`${API_URL}/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};