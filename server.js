const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const pool = require("./config/db");
// const webRoutes = require("./routes/web");
const adminRoutes = require("./routes/adminRoutes");
const webRoutes = require("./routes/webRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV));
app.use(express.static(path.join(__dirname, "public")));



app.use("/frontend", webRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
res.send(`
    <!DOCTYPE html>
    <html lang="en" class="h-full bg-slate-950">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Server Status</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="h-full flex items-center justify-center p-4 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      <main class="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 relative">
          <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-emerald-400 opacity-20"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
          Server is up and running
        </h1>
        <p class="text-sm text-slate-400 mb-6">
          All systems are operational and responding normally.
        </p>
        <div class="grid grid-cols-2 gap-3 text-xs text-slate-400 border-t border-slate-800 pt-6">
          <div class="bg-slate-800/40 border border-slate-800/80 rounded-lg p-2.5">
            <span class="block text-slate-500 mb-0.5">Status</span>
            <span class="font-medium text-emerald-400">200 OK</span>
          </div>
          <div class="bg-slate-800/40 border border-slate-800/80 rounded-lg p-2.5">
            <span class="block text-slate-500 mb-0.5">Environment</span>
            <span class="font-medium text-slate-200">${process.env.NODE_ENV === "dev" ? "Development" : "Production"}</span>
          </div>
        </div>
      </main>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const connection = await pool.getConnection();

        console.log("✅ Connected to MySQL");

        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database connection failed");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();