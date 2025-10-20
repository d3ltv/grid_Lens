import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { 
  createProject, getProject, getUserProjects, updateProject, deleteProject,
  createCreativeConcept, getCreativeConcept, updateCreativeConcept,
  createMoodboardImage, getProjectMoodboardImages, deleteMoodboardImage,
  createScene, getProjectScenes, updateScene, deleteScene,
  createSceneImage, getSceneImages, deleteSceneImage,
  createLocation, getProjectLocations, updateLocation, deleteLocation,
  createLocationImage, getLocationImages, deleteLocationImage,
  createTalent, getProjectTalents, updateTalent, deleteTalent,
  createTalentImage, getTalentImages, deleteTalentImage,
  createEquipment, getProjectEquipment, updateEquipment, deleteEquipment,
  createTimelineEntry, getProjectTimeline, updateTimelineEntry, deleteTimelineEntry,
  createTeamMember, getProjectTeamMembers, updateTeamMember, deleteTeamMember,
  createProjectNote, getProjectNotes, updateProjectNote, deleteProjectNote,
} from "./db";
import { storagePut, storageGet } from "./storage";
import { v4 as uuidv4 } from "uuid";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== PROJECT PROCEDURES ==========
  project: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        clientName: z.string().optional(),
        projectObjective: z.string().optional(),
        targetAudience: z.string().optional(),
        estimatedDuration: z.string().optional(),
        diffusionFormat: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const projectId = uuidv4();
        return createProject({
          id: projectId,
          userId: ctx.user.id,
          ...input,
        });
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserProjects(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return getProject(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        clientName: z.string().optional(),
        projectObjective: z.string().optional(),
        targetAudience: z.string().optional(),
        estimatedDuration: z.string().optional(),
        diffusionFormat: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateProject(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteProject(input.id);
        return { success: true };
      }),
  }),

  // ========== CREATIVE CONCEPT PROCEDURES ==========
  creativeConcept: router({
    getOrCreate: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .mutation(async ({ input }) => {
        let concept = await getCreativeConcept(input.projectId);
        if (!concept) {
          concept = await createCreativeConcept({
            id: uuidv4(),
            projectId: input.projectId,
          });
        }
        return concept;
      }),

    update: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        synopsis: z.string().optional(),
        keyMessage: z.string().optional(),
        tone: z.string().optional(),
        style: z.string().optional(),
        musicType: z.string().optional(),
        musicDescription: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { projectId, ...data } = input;
        return updateCreativeConcept(projectId, data);
      }),
  }),

  // ========== MOODBOARD IMAGES PROCEDURES ==========
  moodboardImage: router({
    upload: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        fileBuffer: z.instanceof(Buffer),
        fileName: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const s3Key = `moodboard/${input.projectId}/${uuidv4()}-${input.fileName}`;
        const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
        
        return createMoodboardImage({
          id: uuidv4(),
          projectId: input.projectId,
          imageUrl: url,
          s3Key,
          description: input.description,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectMoodboardImages(input.projectId);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteMoodboardImage(input.id);
        return { success: true };
      }),
  }),

  // ========== SCENES PROCEDURES ==========
  scene: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        sceneNumber: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        actions: z.string().optional(),
        dialogue: z.string().optional(),
        voiceOver: z.string().optional(),
        duration: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createScene({
          id: uuidv4(),
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectScenes(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        sceneNumber: z.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        actions: z.string().optional(),
        dialogue: z.string().optional(),
        voiceOver: z.string().optional(),
        duration: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateScene(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteScene(input.id);
        return { success: true };
      }),
  }),

  // ========== SCENE IMAGES PROCEDURES ==========
  sceneImage: router({
    upload: protectedProcedure
      .input(z.object({
        sceneId: z.string(),
        fileBuffer: z.instanceof(Buffer),
        fileName: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const s3Key = `scenes/${input.sceneId}/${uuidv4()}-${input.fileName}`;
        const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
        
        return createSceneImage({
          id: uuidv4(),
          sceneId: input.sceneId,
          imageUrl: url,
          s3Key,
          caption: input.caption,
        });
      }),

    list: protectedProcedure
      .input(z.object({ sceneId: z.string() }))
      .query(async ({ input }) => {
        return getSceneImages(input.sceneId);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteSceneImage(input.id);
        return { success: true };
      }),
  }),

  // ========== LOCATIONS PROCEDURES ==========
  location: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        name: z.string().min(1),
        address: z.string().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createLocation({
          id: uuidv4(),
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectLocations(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        address: z.string().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateLocation(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteLocation(input.id);
        return { success: true };
      }),
  }),

  // ========== LOCATION IMAGES PROCEDURES ==========
  locationImage: router({
    upload: protectedProcedure
      .input(z.object({
        locationId: z.string(),
        fileBuffer: z.instanceof(Buffer),
        fileName: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const s3Key = `locations/${input.locationId}/${uuidv4()}-${input.fileName}`;
        const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
        
        return createLocationImage({
          id: uuidv4(),
          locationId: input.locationId,
          imageUrl: url,
          s3Key,
          caption: input.caption,
        });
      }),

    list: protectedProcedure
      .input(z.object({ locationId: z.string() }))
      .query(async ({ input }) => {
        return getLocationImages(input.locationId);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteLocationImage(input.id);
        return { success: true };
      }),
  }),

  // ========== TALENTS PROCEDURES ==========
  talent: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        name: z.string().min(1),
        role: z.string().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createTalent({
          id: uuidv4(),
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectTalents(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        role: z.string().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateTalent(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteTalent(input.id);
        return { success: true };
      }),
  }),

  // ========== TALENT IMAGES PROCEDURES ==========
  talentImage: router({
    upload: protectedProcedure
      .input(z.object({
        talentId: z.string(),
        fileBuffer: z.instanceof(Buffer),
        fileName: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const s3Key = `talents/${input.talentId}/${uuidv4()}-${input.fileName}`;
        const { url } = await storagePut(s3Key, input.fileBuffer, "image/jpeg");
        
        return createTalentImage({
          id: uuidv4(),
          talentId: input.talentId,
          imageUrl: url,
          s3Key,
          caption: input.caption,
        });
      }),

    list: protectedProcedure
      .input(z.object({ talentId: z.string() }))
      .query(async ({ input }) => {
        return getTalentImages(input.talentId);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteTalentImage(input.id);
        return { success: true };
      }),
  }),

  // ========== EQUIPMENT PROCEDURES ==========
  equipment: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        name: z.string().min(1),
        category: z.string().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createEquipment({
          id: uuidv4(),
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectEquipment(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateEquipment(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteEquipment(input.id);
        return { success: true };
      }),
  }),

  // ========== TIMELINE PROCEDURES ==========
  timeline: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        phaseName: z.string().min(1),
        description: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        return createTimelineEntry({
          id: uuidv4(),
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectTimeline(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        phaseName: z.string().optional(),
        description: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateTimelineEntry(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteTimelineEntry(input.id);
        return { success: true };
      }),
  }),

  // ========== TEAM MEMBERS PROCEDURES ==========
  teamMember: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        name: z.string().min(1),
        role: z.string().min(1),
        email: z.string().optional(),
        phone: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createTeamMember({
          id: uuidv4(),
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectTeamMembers(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        role: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateTeamMember(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteTeamMember(input.id);
        return { success: true };
      }),
  }),

  // ========== PDF GENERATION PROCEDURES ==========
  pdf: router({
    generateProjectPDF: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .mutation(async ({ input }) => {
        const { generateProjectPDF } = await import("./pdfGenerator");
        const buffer = await generateProjectPDF(input.projectId);
        
        const project = await getProject(input.projectId);
        const fileName = `${project?.title || "projet"}_preproduction.docx`;
        
        // Upload to S3
        const { url } = await storagePut(
          `pdfs/${input.projectId}/${Date.now()}-${fileName}`,
          buffer,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        
        return { url, fileName };
      }),
  }),

  // ========== PROJECT NOTES PROCEDURES ==========
  projectNote: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createProjectNote({
          id: uuidv4(),
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        return getProjectNotes(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateProjectNote(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await deleteProjectNote(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

