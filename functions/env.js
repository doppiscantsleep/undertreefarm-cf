export async function envReq(context) {
    const weatherapi = context.env.OPENWEATHER_KEY;
  
    return new Response(weatherapi)
  }