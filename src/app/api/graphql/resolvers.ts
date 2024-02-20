import { Process } from "@/data/consts";
import { Agent } from "@/types/agent";
import { CreateMissionInput, Mission } from "@/types/mission";
import { Task } from "@/types/task";
import prisma from "@/utils/prisma";
import { GraphQLResolveInfo } from "graphql";
import { NextRequest, NextResponse } from "next/server";

const resolvers = {
  Query: {
    agents: () => {
      return prisma.agent.findMany();
    },
    agent: (id: number) => {
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
    mission: (id: number) => {
      return prisma.mission.findFirst({
        where: {
          id: id,
        },
      });
    },
  },
  Mutation: {
    createAgent: async (
      parent: any,
      body: Agent,
      context: { req: NextRequest; res: NextResponse; datasource: any },
      info: GraphQLResolveInfo
    ) => {
      const agent = await prisma.agent.create({ data: body });
      return agent;
    },
    updateAgent: async (
      parent: any,
      body: Agent,
      context: { req: NextRequest; res: NextResponse; datasource: any },
      info: GraphQLResolveInfo
    ) => {
      const updatedAgent = await prisma.agent.update({
        where: { id: body.id },
        data: body,
      });
      return updatedAgent;
    },
    deleteAgent: async (
      parent: any,
      body: { id: number },
      context: { req: NextRequest; res: NextResponse; datasource: any },
      info: GraphQLResolveInfo
    ) => {
      await prisma.agent.delete({ where: { id: body.id } });
      return { deleted: true };
    },
    createMission: async (
      parent: any,
      body: CreateMissionInput,
      context: { req: NextRequest; res: NextResponse; datasource: any },
      info: GraphQLResolveInfo
    ) => {
      const { name, verbose, process } = body;
      const crew = await prisma.agent.findMany({
        where: {
          id: {
            in: body.crew,
          },
        },
      });
      const tasks: Array<Task> = [];
      for (let task of body.tasks) {
        const agent = await prisma.agent.findFirst({
          where: { id: task.agent },
        });
        tasks.push({
          ...task,
          agent,
        });
      }
      const mission = await prisma.mission.create({
        data: {
          name,
          verbose: !!verbose,
          process: process ?? Process.SEQUENTIAL,
          crew: { create: crew },
          tasks,
          result: "",
        },
      });
      mission.id;
      return mission;
    },
    updateMission: async (
      parent: any,
      body: CreateMissionInput,
      context: { req: NextRequest; res: NextResponse; datasource: any },
      info: GraphQLResolveInfo
    ) => {
      const { id, name, verbose, process } = body;
      const crew = await prisma.agent.findMany({
        where: {
          id: {
            in: body.crew,
          },
        },
      });
      const tasks: Array<Task> = [];
      if (body.tasks) {
        for (let task of body.tasks) {
          const agent = await prisma.agent.findFirst({
            where: { id: task.agent },
          });
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
    deleteMission: async (
      parent: any,
      body: { id: number },
      context: { req: NextRequest; res: NextResponse; datasource: any },
      info: GraphQLResolveInfo
    ) => {
      await prisma.mission.delete({ where: { id: body.id } });
      return { deleted: true };
    },
    runMission: async (
      parent: any,
      body: { id: number },
      context: { req: NextRequest; res: NextResponse; datasource: any },
      info: GraphQLResolveInfo
    ) => {},
  },
};

export default resolvers;
