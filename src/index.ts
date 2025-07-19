import { z } from "genkit";
import { Client } from "pg";

// Define input schema for the database flow
const DbInputSchema = z.object({
  user: z.string(),
  host: z.string(),
  database: z.string(),
  password: z.string(),
  port: z.number(),
});

// Define the PostgreSQL flow
export const postgresFlow = (ai: any) =>
  ai.defineFlow(
    {
      name: "postgresFlow",
      inputSchema: DbInputSchema,
      outputSchema: z.any(),
    },
    async (input: any) => {
      const client = new Client({
        user: input.user,
        host: input.host,
        database: input.database,
        password: input.password,
        port: input.port,
      });

      try {
        await client.connect();
        const res = await client.query(
          "SELECT title, description, region from news_articles LIMIT 5;"
        );
        return res.rows;
      } finally {
        await client.end();
      }
    }
  );

// Define input schema for the game recommendation flow
const GameRecommendationInputSchema = z.object({
  mood: z.string(),
  genre: z.string(),
});

// Define the game object schema
const GameSchema = z.object({
  title: z.string(),
  mood: z.string(),
  genre: z.string(),
});

// Define the output schema for the game recommendation flow
const GameRecommendationOutputSchema = z.object({
  recommendations: z.array(GameSchema),
});

// Define the game recommendation flow
export const gameRecommendationFlow = (ai: any) =>
  ai.defineFlow(
    {
      name: "gameRecommendationFlow",
      inputSchema: GameRecommendationInputSchema,
      outputSchema: GameRecommendationOutputSchema,
    },
    async (input: any) => {
      const games = [
        { title: "The Witcher 3: Wild Hunt", mood: "adventure", genre: "RPG" },
        { title: "Stardew Valley", mood: "relaxing", genre: "Simulation" },
        { title: "Doom (2016)", mood: "action", genre: "FPS" },
        { title: "Portal 2", mood: "puzzle", genre: "Puzzle" },
        { title: "The Elder Scrolls V: Skyrim", mood: "adventure", genre: "RPG" },
        { title: "Animal Crossing: New Horizons", mood: "relaxing", genre: "Simulation" },
        { title: "Call of Duty: Modern Warfare", mood: "action", genre: "FPS" },
        { title: "The Talos Principle", mood: "puzzle", genre: "Puzzle" },
      ];

      const recommendations = games.filter(
        (game) => game.mood === input.mood && game.genre === input.genre
      );

      return { recommendations };
    }
  );
