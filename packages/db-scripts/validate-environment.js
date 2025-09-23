const prompt = require("prompt-sync")({ sigint: true });

if (process.env.DOTENV_PATH === 'prod') {
    console.log("Are you really, really sure you want to do this in prod?")

    const confimation = prompt("Type 'Production' to apply to prod.");
    if (confimation !== 'Production') {
        console.log("Cancelling")
        process.exit(0)
    } else {
        console.log(`Applying to prod.`);
    }
}
if (!process.env.DATABASE_URL) {
    console.log("missing DATABASE_URL")
    process.exit(1)
}
