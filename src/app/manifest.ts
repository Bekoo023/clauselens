import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#5b5bd6",
    icons: [{ src: "/icon.svg", type: "image/svg+xml" }],
  };
}
