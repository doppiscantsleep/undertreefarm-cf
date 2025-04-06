interface Env {
    OPENWEATHER_KEY: string;
  }
  
  export async function getWeatherKey(context: { env: Env }): Promise<string> {
    const weatherapi = context.env.OPENWEATHER_KEY;
    if (!weatherapi) {
      throw new Error('OPENWEATHER_KEY is not set in environment variables');
    }
    return weatherapi;
  }