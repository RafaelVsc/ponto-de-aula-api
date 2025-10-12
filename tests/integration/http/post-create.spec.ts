import { JwtService } from "@/infrastructure/security/jwt-service";
import { buildApp } from "@/main/app"
import { UserRole } from "@/domain/entities/User";
import request from "supertest";

describe("POST /posts (integration)", () => {
    let app: ReturnType<typeof buildApp>;
    let jwt: JwtService;

    const UUIDv4 =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Assina um token para o role informado
    const tokenFor = (role: UserRole, id = "author-1", expiresIn?: string) => {
        const svc = expiresIn ? new JwtService(undefined, expiresIn) : jwt;
        return svc.sign({ id, role });
    };

    // Formata um token como header Bearer
    const bearer = (token: string) => `Bearer ${token}`;

    beforeEach(() => {
        app = buildApp();
        jwt = new JwtService();
    });

    it("requires auth (401)", async () => {
        // Sem header Authorization -> authenticate() deve barrar com 401 e mensagem padronizada
        await request(app)
            .post("/posts")
            .send({ title: "t", content: "batata" })
            .expect(401)
            .expect((res) => {
                expect(res.body.error?.message).toBe("Authentication required");
            });
    });

    it.each<{ role: UserRole }>([
        // Roles permitidos pela rota (authorize): TEACHER, ADMIN, SECRETARY
        { role: UserRole.TEACHER },
        { role: UserRole.ADMIN },
        { role: UserRole.SECRETARY },
    ])("creates post for $role (201)", async ({ role }) => {
        await request(app)
            .post("/posts")
            .set("Authorization", bearer(tokenFor(role)))
            .send({ title: "Testing with SUPERTEST", content: "SUPERTEST" })
            .expect(201)
            .expect((res) => {
                expect(res.body).toEqual({
                    status: "success",
                    message: "Post created successfully",
                    data: { id: expect.any(String) },
                });
                expect(res.body.data.id).toMatch(UUIDv4);
            });
    });

    it("returns 403 when STUDENT tries to create a post", async () => {
        // STUDENT não está na lista de roles permitidos -> authorize() deve retornar 403
        await request(app)
            .post("/posts")
            .set("Authorization", bearer(tokenFor(UserRole.STUDENT)))
            .send({ title: "STUDENT Test", content: "STUDENT" })
            .expect(403)
            .expect((res) => {
                expect(res.body.error?.message).toBe("Forbidden");
                expect(res.body.data).toBeUndefined();
            });
    });

});