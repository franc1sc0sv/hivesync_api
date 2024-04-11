import { ZodError } from "zod";

const get_zod_error = ({ error }: { error: ZodError }) => {
  return error.issues[0].message;
};

export const detect_zod_error = ({ error }: any) => {
  if (error instanceof ZodError) {
    const zodError = get_zod_error({ error });
    return { error: zodError };
  }
  return null;
};
