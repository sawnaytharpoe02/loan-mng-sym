import "reflect-metadata";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/app";
import { User } from "../../src/modules/auth/auth.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../src/config/env";


// Setup temporary in-memory database
let mongoServer: MongoMemoryServer;
let token: string;

// Run before all test once
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 12);
    const user = await User.create({
        username: "testadmin",
        email: "admin@test.com",
        password: hashedPassword,
        role: "Admin",
    });

    token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1h" }
    );
});

// Run after all test cases
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Borrower API", () => {
    let borrowerId: string;

    it("POST /api/borrowers - should create a new borrower", async () => {
        const res = await request(app)
            .post("/api/borrowers")
            .set("Authorization", `Bearer ${token}`)
            .send({
                fullName: "John Doe",
                phone: "09123456789",
                email: "john@example.com",
                address: "123 Main Street, Yangon",
                nrc: "12/MAMANA(N)123456",
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.fullName).toBe("John Doe");
        expect(res.body.data.nrc).toBe("12/MAMANA(N)123456");
        borrowerId = res.body.data._id;
    });

    it("GET /api/borrowers - should return all borrowers", async () => {
        const res = await request(app)
            .get("/api/borrowers")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("GET /api/borrowers/:id - should return a specific borrower", async () => {
        const res = await request(app)
            .get(`/api/borrowers/${borrowerId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data._id).toBe(borrowerId);
    });

    it("PUT /api/borrowers/:id - should update a borrower", async () => {
        const res = await request(app)
            .put(`/api/borrowers/${borrowerId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fullName: "John Updated" });

        expect(res.status).toBe(200);
        expect(res.body.data.fullName).toBe("John Updated");
    });

    it("DELETE /api/borrowers/:id - should delete a borrower", async () => {
        const res = await request(app)
            .delete(`/api/borrowers/${borrowerId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("POST /api/borrowers - should fail without auth", async () => {
        const res = await request(app)
            .post("/api/borrowers")
            .send({
                fullName: "Test",
                phone: "09123456789",
                email: "test@example.com",
                address: "123 Test Street",
                identificationNumber: "12/XYZ(N)654321",
            });

        expect(res.status).toBe(401);
    });
});
