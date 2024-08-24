import {
  UserInputLoginSc,
  UserInputRegisterSc,
  UserSc,
} from "../schemas/user.schema";

export type UserInputLogin = z.infer<typeof UserInputLoginSc>;
export type UserInputRegister = z.infer<typeof UserInputRegisterSc>;

type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  token: string;
  profileUrl: string;
  backgroundUrl: string;
  name: string;
  createdAt: string;
  about: string;
};
