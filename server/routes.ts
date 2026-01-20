import { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertProjectSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed Data
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    await storage.createProject({
      title: "Career-Saarthi-AI",
      description: "Full-stack AI career guidance platform using Next.js 15, tRPC, Prisma.",
      content: "Developed a full-stack, type-safe AI career guidance platform using Next.js 15, tRPC, Prisma, and PostgreSQL. Implemented a Personalized AI Agent using an Inngest queue system and OpenAI to analyze user data and deliver long-running reports.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder
      icon: "folder",
      date: "Oct 2024"
    });
    await storage.createProject({
      title: "CodeSurfer",
      description: "AI-driven code generation platform using Next.js and E2B Sandbox.",
      content: "Built an AI-driven code generation platform using Next.js, tRPC, Prisma, and the OpenAI API. Enabled safe, sandboxed code execution in isolated environments using the E2B Sandbox API.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      icon: "folder",
      date: "Sep 2024"
    });
    await storage.createProject({
      title: "Stocks",
      description: "Full-stack trading platform using MVC architecture.",
      content: "Built a full-stack trading platform using HTML, CSS, JavaScript, Node.js, and Express. Followed a modular MVC architecture and integrated real-time stock data from external APIs.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      icon: "folder",
      date: "Aug 2024"
    });
  }

  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  });

  return httpServer;
}
