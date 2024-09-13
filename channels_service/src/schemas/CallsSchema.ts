import { z } from "zod";

export const CreateCallSchema = z.object({
  roomId: z.string().uuid(),
  participants: z.array(z.string().uuid()),
});

export const AccepCallSchema = z.object({
  participant: z.string().uuid(),
});

export const AddParticipantsSchema = z.object({
  participants: z.array(z.string().uuid()),
});
