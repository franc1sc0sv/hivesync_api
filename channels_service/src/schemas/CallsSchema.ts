import { z } from "zod";

export const CreateCallSchema = z.object({
  roomId: z.string().uuid(),
  participants: z.array(z.string().uuid()),
});

export const EditCallSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "ENDED"]),
});

export const AddParticipantsSchema = z.object({
  participants: z.array(z.string().uuid()),
});
