import { z } from "zod";

export const CreateCallSchema = z.object({
  roomId: z.string().uuid(),
  participants: z.array(
    z.object({
      userId: z.string().uuid(),
      isMicrofoneActive: z.boolean(),
      IsCameraActive: z.boolean(),
    })
  ),
  creator_id: z.string().uuid(),
});

export const AccepCallSchema = z.object({
  participant: z.string().uuid(),
  isMicrofoneActive: z.boolean(),
  IsCameraActive: z.boolean(),
});

export const AddParticipantsSchema = z.object({
  participants: z.array(z.string().uuid()),
});

export const ParticipantParamsSchema = z.object({
  isMicrofoneActive: z.boolean(),
  IsCameraActive: z.boolean(),
});
