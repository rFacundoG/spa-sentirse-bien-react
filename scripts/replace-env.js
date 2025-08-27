// scripts/replace-env.js
const fs = require("fs");
const path = require("path");

// Obtener variables de entorno de process.env
const env = {
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || "",
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || "",
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || "",
};

// Ruta a la carpeta de build (donde se genera tu app)
const buildPath = path.join(__dirname, "../dist");

// Función para buscar y reemplazar en archivos
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;

    // Reemplazar cada variable de entorno
    Object.keys(env).forEach((key) => {
      const regex = new RegExp(`import\\.meta\\.env\\.${key}`, "g");
      if (regex.test(content)) {
        content = content.replace(regex, `"${env[key]}"`);
        changed = true;
        console.log(`✓ Replaced ${key} in ${path.basename(filePath)}`);
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Función para recorrer todos los archivos en la carpeta de build
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath); // recursividad para subdirectorios
    } else if (stat.isFile() && file.endsWith(".js")) {
      replaceInFile(filePath); // procesar archivos JS
    }
  });
}

// Ejecutar el proceso
console.log("Replacing environment variables in build files...");
processDirectory(buildPath);
console.log("Environment variables replacement completed!");
