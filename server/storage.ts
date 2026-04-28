import { type Project, type InsertProject } from "../shared/schema.js";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}

export class MemStorage implements IStorage {
  private projects: Project[];
  private currentId: number;

  constructor() {
    this.projects = [
      {
        id: 1,
        title: "Career-Saarthi-AI",
        description: "Full-stack AI career guidance platform using Next.js 15, tRPC, Prisma.",
        content: "Developed a full-stack, type-safe AI career guidance platform using Next.js 15, tRPC, Prisma, and PostgreSQL. Implemented a Personalized AI Agent using an Inngest queue system and OpenAI to analyze user data and deliver long-running reports.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        icon: "folder",
        date: "Oct 2024"
      },
      {
        id: 2,
        title: "CodeSurfer",
        description: "AI-driven code generation platform using Next.js and E2B Sandbox.",
        content: "Built an AI-driven code generation platform using Next.js, tRPC, Prisma, and the OpenAI API. Enabled safe, sandboxed code execution in isolated environments using the E2B Sandbox API.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        icon: "folder",
        date: "Sep 2024"
      },
      {
        id: 3,
        title: "Stocks",
        description: "Full-stack trading platform using MVC architecture.",
        content: "Built a full-stack trading platform using HTML, CSS, JavaScript, Node.js, and Express. Followed a modular MVC architecture and integrated real-time stock data from external APIs.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        icon: "folder",
        date: "Aug 2024"
      }
    ];
    this.currentId = 4;
  }

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.find((p) => p.id === id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = { ...insertProject, id: this.currentId++ };
    this.projects.push(project);
    return project;
  }
}

export const storage = new MemStorage();
