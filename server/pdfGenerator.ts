import { Document, Packer, Paragraph, Table, TableCell, TableRow, convertInchesToTwip, WidthType, AlignmentType, TextRun, PageBreak, HeadingLevel, BorderStyle } from "docx";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { 
  projects, creativeConcepts, scenes, locations, talents, equipment, 
  timeline, teamMembers, projectNotes, moodboardImages, sceneImages,
  locationImages, talentImages
} from "../drizzle/schema";

export async function generateProjectPDF(projectId: string): Promise<Buffer> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Fetch all project data
  const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project.length) throw new Error("Project not found");

  const projectData = project[0];
  const concept = await db.select().from(creativeConcepts).where(eq(creativeConcepts.projectId, projectId)).limit(1);
  const projectScenes = await db.select().from(scenes).where(eq(scenes.projectId, projectId));
  const projectLocations = await db.select().from(locations).where(eq(locations.projectId, projectId));
  const projectTalents = await db.select().from(talents).where(eq(talents.projectId, projectId));
  const projectEquipment = await db.select().from(equipment).where(eq(equipment.projectId, projectId));
  const projectTimeline = await db.select().from(timeline).where(eq(timeline.projectId, projectId));
  const projectTeam = await db.select().from(teamMembers).where(eq(teamMembers.projectId, projectId));
  const projectNotesData = await db.select().from(projectNotes).where(eq(projectNotes.projectId, projectId));

  const sections: any[] = [];

  // Title Page
  sections.push({
    children: [
      new Paragraph({
        text: "DOCUMENT DE PRÉ-PRODUCTION",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "DOCUMENT DE PRÉ-PRODUCTION", bold: true, size: 32 })],
      }),
      new Paragraph({
        text: projectData.title,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: projectData.title, size: 28 })],
      }),
      new Paragraph({
        text: projectData.clientName ? `Client: ${projectData.clientName}` : "",
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        text: `Date: ${new Date().toLocaleDateString("fr-FR")}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      }),
      new PageBreak(),
    ],
  });

  // Table of Contents
  sections.push({
    children: [
      new Paragraph({
        text: "TABLE DES MATIÈRES",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: "1. Informations Générales",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "2. Direction Créative",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "3. Scènes et Storyboard",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "4. Lieux de Tournage",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "5. Talents et Acteurs",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "6. Équipement",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "7. Calendrier de Production",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "8. Équipe de Production",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "9. Notes et Remarques",
        spacing: { after: 400 },
      }),
      new PageBreak(),
    ],
  });

  // 1. General Information
  sections.push({
    children: [
      new Paragraph({
        text: "1. INFORMATIONS GÉNÉRALES",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Titre du Projet", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.title })]
              }),
            ],
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Client", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.clientName || "N/A" })]
              }),
            ],
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Objectif", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.projectObjective || "N/A" })]
              }),
            ],
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Public Cible", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.targetAudience || "N/A" })]
              }),
            ],
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Durée Estimée", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.estimatedDuration || "N/A" })]
              }),
            ],
          }),
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: "Format de Diffusion", bold: true })]
                })]
              }),
              new TableCell({
                children: [new Paragraph({ text: projectData.diffusionFormat || "N/A" })]
              }),
            ],
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 400 } }),
      new PageBreak(),
    ],
  });

  // 2. Creative Concept
  if (concept.length > 0) {
    const conceptData = concept[0];
    sections.push({
      children: [
        new Paragraph({
          text: "2. DIRECTION CRÉATIVE",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
        ...(conceptData.synopsis ? [
          new Paragraph({
            text: "Synopsis",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: conceptData.synopsis,
            spacing: { after: 200 },
          }),
        ] : []),
        ...(conceptData.keyMessage ? [
          new Paragraph({
            text: "Message Clé",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: conceptData.keyMessage,
            spacing: { after: 200 },
          }),
        ] : []),
        ...(conceptData.tone ? [
          new Paragraph({
            text: `Ton: ${conceptData.tone}`,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(conceptData.style ? [
          new Paragraph({
            text: `Style: ${conceptData.style}`,
            spacing: { after: 200 },
          }),
        ] : []),
        ...(conceptData.musicType ? [
          new Paragraph({
            text: "Musique",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Type: ${conceptData.musicType}`,
            spacing: { after: 100 },
          }),
          ...(conceptData.musicDescription ? [
            new Paragraph({
              text: conceptData.musicDescription,
              spacing: { after: 200 },
            }),
          ] : []),
        ] : []),
        new PageBreak(),
      ],
    });
  }

  // 3. Scenes
  if (projectScenes.length > 0) {
    const sceneChildren: any[] = [
      new Paragraph({
        text: "3. SCÈNES ET STORYBOARD",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    for (const scene of projectScenes) {
      sceneChildren.push(
        new Paragraph({
          text: `Scène ${scene.sceneNumber}: ${scene.title || "(Sans titre)"}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        ...(scene.duration ? [
          new Paragraph({
            text: `Durée: ${scene.duration}`,
            spacing: { after: 100 },
            children: [new TextRun({ text: `Durée: ${scene.duration}`, italics: true })]
          }),
        ] : []),
        ...(scene.description ? [
          new Paragraph({
            text: "Description:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Description:", bold: true })]
          }),
          new Paragraph({
            text: scene.description,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(scene.actions ? [
          new Paragraph({
            text: "Actions:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Actions:", bold: true })]
          }),
          new Paragraph({
            text: scene.actions,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(scene.dialogue ? [
          new Paragraph({
            text: "Dialogues:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Dialogues:", bold: true })]
          }),
          new Paragraph({
            text: scene.dialogue,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(scene.voiceOver ? [
          new Paragraph({
            text: "Voix off:",
            spacing: { after: 50 },
            children: [new TextRun({ text: "Voix off:", bold: true })]
          }),
          new Paragraph({
            text: scene.voiceOver,
            spacing: { after: 200 },
          }),
        ] : []),
      );
    }

    sceneChildren.push(new PageBreak());
    sections.push({ children: sceneChildren });
  }

  // 4. Locations
  if (projectLocations.length > 0) {
    const locationChildren: any[] = [
      new Paragraph({
        text: "4. LIEUX DE TOURNAGE",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    for (const location of projectLocations) {
      locationChildren.push(
        new Paragraph({
          text: location.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        ...(location.address ? [
          new Paragraph({
            text: `Adresse: ${location.address}`,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(location.description ? [
          new Paragraph({
            text: location.description,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(location.notes ? [
          new Paragraph({
            text: `Notes: ${location.notes}`,
            spacing: { after: 200 },
          }),
        ] : []),
      );
    }

    locationChildren.push(new PageBreak());
    sections.push({ children: locationChildren });
  }

  // 5. Talents
  if (projectTalents.length > 0) {
    const talentChildren: any[] = [
      new Paragraph({
        text: "5. TALENTS ET ACTEURS",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    for (const talent of projectTalents) {
      talentChildren.push(
        new Paragraph({
          text: talent.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        ...(talent.role ? [
          new Paragraph({
            text: `Rôle: ${talent.role}`,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(talent.description ? [
          new Paragraph({
            text: talent.description,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(talent.notes ? [
          new Paragraph({
            text: `Notes: ${talent.notes}`,
            spacing: { after: 200 },
          }),
        ] : []),
      );
    }

    talentChildren.push(new PageBreak());
    sections.push({ children: talentChildren });
  }

  // 6. Equipment
  if (projectEquipment.length > 0) {
    const equipmentChildren: any[] = [
      new Paragraph({
        text: "6. ÉQUIPEMENT",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    for (const item of projectEquipment) {
      equipmentChildren.push(
        new Paragraph({
          text: item.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        ...(item.category ? [
          new Paragraph({
            text: `Catégorie: ${item.category}`,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(item.description ? [
          new Paragraph({
            text: item.description,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(item.notes ? [
          new Paragraph({
            text: `Notes: ${item.notes}`,
            spacing: { after: 200 },
          }),
        ] : []),
      );
    }

    equipmentChildren.push(new PageBreak());
    sections.push({ children: equipmentChildren });
  }

  // 7. Timeline
  if (projectTimeline.length > 0) {
    const timelineChildren: any[] = [
      new Paragraph({
        text: "7. CALENDRIER DE PRODUCTION",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    for (const entry of projectTimeline) {
      timelineChildren.push(
        new Paragraph({
          text: entry.phaseName,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        }),
        ...(entry.startDate && entry.endDate ? [
          new Paragraph({
            text: `${new Date(entry.startDate).toLocaleDateString("fr-FR")} - ${new Date(entry.endDate).toLocaleDateString("fr-FR")}`,
            spacing: { after: 100 },
            children: [new TextRun({
              text: `${new Date(entry.startDate).toLocaleDateString("fr-FR")} - ${new Date(entry.endDate).toLocaleDateString("fr-FR")}`,
              italics: true
            })]
          }),
        ] : []),
        ...(entry.description ? [
          new Paragraph({
            text: entry.description,
            spacing: { after: 200 },
          }),
        ] : []),
      );
    }

    timelineChildren.push(new PageBreak());
    sections.push({ children: timelineChildren });
  }

  // 8. Team
  if (projectTeam.length > 0) {
    const teamChildren: any[] = [
      new Paragraph({
        text: "8. ÉQUIPE DE PRODUCTION",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    const teamTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          height: { value: 400, rule: "auto" },
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Nom", bold: true })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Rôle", bold: true })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Contact", bold: true })]
              })]
            }),
          ],
        }),
        ...projectTeam.map(member =>
          new TableRow({
            height: { value: 400, rule: "auto" },
            children: [
              new TableCell({
                children: [new Paragraph({ text: member.name })]
              }),
              new TableCell({
                children: [new Paragraph({ text: member.role })]
              }),
              new TableCell({
                children: [new Paragraph({ text: `${member.email || ""} ${member.phone || ""}`.trim() })]
              }),
            ],
          })
        ),
      ],
    });

    teamChildren.push(teamTable);
    teamChildren.push(new PageBreak());
    sections.push({ children: teamChildren });
  }

  // 9. Notes
  if (projectNotesData.length > 0) {
    const notesChildren: any[] = [
      new Paragraph({
        text: "9. NOTES ET REMARQUES",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    ];

    for (const note of projectNotesData) {
      notesChildren.push(
        ...(note.title ? [
          new Paragraph({
            text: note.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 },
          }),
        ] : []),
        ...(note.category ? [
          new Paragraph({
            text: `[${note.category}]`,
            spacing: { after: 50 },
            children: [new TextRun({
              text: `[${note.category}]`,
              italics: true
            })]
          }),
        ] : []),
        ...(note.content ? [
          new Paragraph({
            text: note.content,
            spacing: { after: 200 },
          }),
        ] : []),
      );
    }

    sections.push({ children: notesChildren });
  }

  // Create document
  const doc = new Document({
    sections,
  });

  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

