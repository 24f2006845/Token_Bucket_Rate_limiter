import type { Role } from "../generated/prisma/client.js";
interface JwtPayload {
    id : string;
    role : Role;
}

export type { JwtPayload };