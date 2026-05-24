export type PersistenceMode = "mock" | "sqlite-local" | "postgres";

export function getPersistenceMode(): PersistenceMode {
  if (process.env.POSTGRES_URL) return "postgres";
  if (process.env.DATABASE_URL?.startsWith("file:")) return "sqlite-local";
  return "mock";
}

export function assertServerPersistenceConfigured() {
  const mode = getPersistenceMode();

  if (mode === "mock") {
    return {
      mode,
      message: "Usando mock-data. Seguro para Vercel preview/free tier sin servicios externos.",
    };
  }

  return {
    mode,
    message: "Persistencia configurada por variables de entorno.",
  };
}

// TODO: Implementar SQLite local con driver dinámico solo para desarrollo, sin incluirlo como dependencia obligatoria de Vercel.
// TODO: Implementar PostgreSQL open-source + pgvector como persistencia productiva.
// TODO: Migrar progreso local a tablas users/progress cuando Auth.js esté activo.
// TODO: Mantener mock-data como fallback para demos estáticas y Vercel previews.
