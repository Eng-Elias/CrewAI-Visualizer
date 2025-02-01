import { Process } from "@/data/consts";
import prisma from "@/utils/prisma";
import { runMission } from "./crew_ai";

const resolvers = {
  Query: {
    agents: () => {
      return prisma.agent.findMany();
    },
    agent: (id) => {
      return prisma.agent.findFirst({
        where: {
          id: id,
        },
      });
    },
    missions: async () => {
      const missions = await prisma.mission.findMany({
        include: {
          crew: true,
        },
      });
      return missions;
    },
    mission: (id) => {
      return prisma.mission.findFirst({
        where: {
          id: id,
        },
      });
    },
  },
  Mutation: {
    createAgent: async (parent, body, context, info) => {
      const agent = await prisma.agent.create({ data: body });
      return agent;
    },
    updateAgent: async (parent, body, context, info) => {
      const updatedAgent = await prisma.agent.update({
        where: { id: body.id },
        data: body,
      });
      return updatedAgent;
    },
    deleteAgent: async (parent, body, context, info) => {
      await prisma.agent.delete({ where: { id: body.id } });
      return { deleted: true };
    },
    createMission: async (parent, body, context, info) => {
      const { name, verbose, process } = body;
      const crew = await prisma.agent.findMany({
        where: {
          id: {
            in: body.crew,
          },
        },
        select: {
          id: true,
        },
      });
      const mission = await prisma.mission.create({
        data: {
          name,
          verbose: !!verbose,
          process: process ?? Process.SEQUENTIAL,
          crew: { connect: crew },
          tasks: [],
          result: "",
        },
      });
      return mission;
    },
    updateMission: async (parent, body, context, info) => {
      const { id, name, verbose, process } = body;
      const crew = await prisma.agent.findMany({
        where: {
          id: {
            in: body.crew,
          },
        },
      });
      const tasks = [];
      if (body.tasks) {
        for (let task of body.tasks) {
          let agent = null;
          if (task.agent) {
            agent = crew.find((a) => a.id === task.agent) ?? null;
          }
          tasks.push({
            ...task,
            agent,
          });
        }
      }
      const mission = await prisma.mission.update({
        where: {
          id,
        },
        include: {
          crew: true,
        },
        data: {
          name,
          verbose: verbose,
          process: process,
          crew: { set: crew.map((agent) => ({ id: agent.id })) },
          tasks,
          result: "",
        },
      });
      return mission;
    },
    deleteMission: async (parent, body, context, info) => {
      await prisma.mission.delete({ where: { id: body.id } });
      return { deleted: true };
    },
    runMission: async (parent, body, context, info) => {
      const result = await runMission(body.id);
      return result;
    },
  },
};

export default resolvers;
