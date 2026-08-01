import type { Role } from "../generated/prisma/client.js";
interface JwtPayload {
    userId : string;
    role : Role;
}

export type { JwtPayload };