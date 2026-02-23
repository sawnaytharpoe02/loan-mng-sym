import app from "./app";
import { connectDatabase } from "./config/database";
import { configureGracefulShutdown } from "./utils/shutdown";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { container } from "./config/container";
import { InterestRateService } from "./modules/interest-rate/interest-rate.service";
import fs from "fs";
import path from "path";

const start = async () => {
    // Ensure logs directory exists
    const logsDir = path.join(__dirname, "../logs");
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    // Connect to database
    await connectDatabase();

    // Seed interest rates
    const interestRateService = container.resolve<InterestRateService>("InterestRateService");
    await interestRateService.seed();

    // Start server
    const server = app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT}`);
        logger.info(`Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    configureGracefulShutdown(server);
};

start().catch((error) => {
    logger.error("Failed to start server:", error);
    process.exit(1);
});
