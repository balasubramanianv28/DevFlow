import axios from "axios";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/tasks`;
export interface Task {
    _id: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate: string | null;
    project: {
        _id: string;
        name: string;
    };
    owner: string;
    createdAt: string;
    updatedAt: string;
}

export const getTasks = async (
    projectId?: string
): Promise<Task[]> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        return [];
    }

    const response = await axios.get(API_URL, {
        params: projectId
            ? { project: projectId }
            : undefined,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.tasks;
};

export const createTask = async (
    taskData: {
        title: string;
        description?: string;
        status?: "todo" | "in-progress" | "completed";
        priority?: "low" | "medium" | "high";
        dueDate?: string | null;
        project: string;
    }
): Promise<Task> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    const response = await axios.post(
        API_URL,
        taskData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.task;
};

export const updateTask = async (
    taskId: string,
    taskData: {
        title?: string;
        description?: string;
        status?: "todo" | "in-progress" | "completed";
        priority?: "low" | "medium" | "high";
        dueDate?: string | null;
        project?: string;
    }
): Promise<Task> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    const response = await axios.patch(
        `${API_URL}/${taskId}`,
        taskData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.task;
};  

export const deleteTask = async (
    taskId: string
): Promise<void> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    await axios.delete(
        `${API_URL}/${taskId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};