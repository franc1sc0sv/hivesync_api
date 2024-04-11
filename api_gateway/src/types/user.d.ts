import {
  UserInputLoginSc,
  UserInputRegisterSc,
  UserSc,
} from "../schemas/user.schema";

export type UserInputLogin = z.infer<typeof UserInputLoginSc>;
export type UserInputRegister = z.infer<typeof UserInputRegisterSc>;
export type User = z.infer<typeof UserSc>;
