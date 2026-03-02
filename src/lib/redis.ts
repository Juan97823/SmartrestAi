/**
 * @fileOverview Configuración de cliente Redis para caché de predicciones de IA.
 * En AWS/Azure, este cliente conectaría con una instancia de Redis administrada.
 */

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

/**
 * Función de utilidad para cachear resultados de IA pesados.
 * @param key Clave única para la predicción
 * @param fetcher Función que genera la predicción si no está en caché
 */
export async function getOrCachePrediction<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  console.log(`[Cache] Buscando predicción en Redis para: ${key}`);
  
  // En este prototipo simulamos la lógica de caché
  // En producción usarías: const cached = await redis.get(key);
  
  const result = await fetcher();
  return result;
}
