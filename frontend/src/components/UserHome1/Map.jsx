import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Map as MapLibreMap, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import polyline from "@mapbox/polyline";
import { Spin } from "antd";

const RouteMap = ({ origin, destination }) => {
  console.log(origin, destination);
  const mapContainerRef = useRef(null);
  const [distance, setDistance] = useState(null);
  const originMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_OLA_KEY;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new MapLibreMap({
      container: mapContainerRef.current,
      center: [78.9629, 20.5937], // Centered over India
      zoom: 3.3,
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      transformRequest: (url, resourceType) => {
        if (!url.includes("?")) {
          url += `?api_key=${apiKey}`;
        } else {
          url += `&api_key=${apiKey}`;
        }
        return { url, resourceType };
      },
    });

    const nav = new NavigationControl({
      visualizePitch: true,
    });
    mapInstance.addControl(nav, "top-left");

    mapInstance.on("load", () => {
      setMap(mapInstance);
      setLoading(false);
    });

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const fetchRoute = async () => {
      setLoading(true);
      try {
        const apiUrl = `https://api.olamaps.io/routing/v1/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternatives=false&steps=true&overview=full&language=en&traffic_metadata=false&api_key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: "",
        });

        const data = await response.json();
        const route = data.routes[0];
        setDistance(route.legs[0].distance / 1000);

        if (route && route.overview_polyline) {
          const routeCoordinates = polyline
            .decode(route.overview_polyline)
            .map((coord) => [coord[1], coord[0]]);

          const geojson = {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          };

          if (map.getLayer("route")) {
            map.removeLayer("route");
            map.removeSource("route");
          }

          map.addSource("route", {
            type: "geojson",
            data: geojson,
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#4585EB",
              "line-width": 5,
            },
          });

          originMarkerRef.current = new maplibregl.Marker({
            color: "#00FF00",
          })
            .setLngLat([origin.lng, origin.lat])
            .setPopup(
              new maplibregl.Popup().setText(`Origin: ${origin.description}`)
            )
            .addTo(map);

          destinationMarkerRef.current = new maplibregl.Marker({
            color: "#FF0000",
          })
            .setLngLat([destination.lng, destination.lat])
            .setPopup(
              new maplibregl.Popup().setText(
                `Destination: ${destination.description}`
              )
            )
            .addTo(map);

          const bounds = new maplibregl.LngLatBounds();
          routeCoordinates.forEach((coord) => {
            bounds.extend(coord);
          });
          map.fitBounds(bounds, { padding: 20 });
        } else {
          console.error("Invalid polyline data");
        }
      } catch (error) {
        console.error("Error fetching route:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [map, origin, destination]);

  return (
    <div className="relative w-[5/6] h-[80vh] mt-8 border border-gray-300 shadow-2xl m-10 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-3xl">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
          <Spin className="animate-spin-slow text-blue-500" />
        </div>
      )}
      <div
        ref={mapContainerRef}
        id="route-map"
        className="h-full w-full transition-transform duration-500 hover:scale-[1.01]"
      />
      <div className="absolute bottom-5 left-5 bg-white bg-opacity-60 p-2 rounded-lg shadow-lg border border-blue-400 transition-transform duration-300 transform hover:-translate-y-1">
        <p className="text-xs  flex items-center gap-2">
          <span className="material-icons text-blue-500 font-semibold">
            {" "}
            Distance:
          </span>
          {distance ?? "N/A"} km
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs">
          <span className="material-icons text-green-500 font-bold">From:</span>
          {origin?.description.split(" ").slice(0, 8).join(" ") +
            (origin?.description.split(" ").length > 8 ? "..." : "")}
        </p>
        <p className="mt-1 flex items-center gap-2 text-xs">
          <span className="material-icons text-red-500 font-bold">To: </span>
          {destination?.description.split(" ").slice(0, 10).join(" ") +
            (destination?.description.split(" ").length > 10 ? "..." : "")}
        </p>
      </div>
    </div>
  );
};

export default RouteMap;
