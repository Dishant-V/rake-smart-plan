import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: string;
  forecast: string;
}

const WeatherForecast = () => {
  const [weather, setWeather] = useState<WeatherData>({
    location: "Ranchi, Jharkhand",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: "Good",
    forecast: "Favorable conditions for logistics operations",
  });

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Rain")) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (condition.includes("Cloud")) return <Cloud className="h-8 w-8 text-gray-500" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        {getWeatherIcon(weather.condition)}
        <h2 className="text-2xl font-bold">Weather Forecast</h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-2">{weather.location}</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-5xl font-bold">{weather.temperature}°C</p>
          </div>
          <p className="text-lg text-muted-foreground mt-2">{weather.condition}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Wind className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <p className="font-semibold">{weather.windSpeed} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 col-span-2">
            <Eye className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="font-semibold">{weather.visibility}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-center">{weather.forecast}</p>
        </div>
      </motion.div>
    </Card>
  );
};

export default WeatherForecast;
