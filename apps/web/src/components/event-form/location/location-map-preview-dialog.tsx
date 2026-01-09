"use client";

import * as React from "react";
import { importLibrary } from "@googlemaps/js-api-loader";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Map, MapMarker, MarkerPopup, MarkerContent, MapControls } from "@/components/ui/map";
import { env } from "@repo/env/client";

interface LocationMapPreviewDialogProps {
    location: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const hasGoogleMapsKey = Boolean(env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

// Available map styles
const MAP_STYLES = {
    light: {
        name: "Light",
        url: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    },
    dark: {
        name: "Dark",
        url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    },
    voyager: {
        name: "Streets",
        url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    },
    satellite: {
        name: "Satellite",
        url: "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
    },
} as const;

type MapStyleKey = keyof typeof MAP_STYLES;

export function LocationMapPreviewDialog({
    location,
    open,
    onOpenChange,
}: LocationMapPreviewDialogProps) {
    const [selectedLayer, setSelectedLayer] = React.useState<MapStyleKey>("light");

    const { data: coords, isLoading } = useQuery({
        queryKey: ["geocode", location],
        queryFn: async () => {
            if (!hasGoogleMapsKey || !location) return null;

            const { Geocoder } = await importLibrary("geocoding");
            const geocoder = new Geocoder();

            try {
                const response = await geocoder.geocode({ address: location });
                if (response.results[0]?.geometry?.location) {
                    const res = response.results[0];
                    return {
                        lat: res.geometry.location.lat(),
                        lng: res.geometry.location.lng(),
                        address: res.formatted_address,
                    };
                }
            } catch (e) {
                console.error("Geocoding failed", e);
            }
            return null;
        },
        enabled: open && Boolean(location) && hasGoogleMapsKey,
    });

    const currentStyle = MAP_STYLES[selectedLayer];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Location Preview</DialogTitle>
                </DialogHeader>
                <div className="h-[60vh] w-full overflow-hidden rounded-md border bg-muted relative">
                    {isLoading ? (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            Loading map...
                        </div>
                    ) : coords ? (
                        <Map
                            key={selectedLayer}
                            center={[coords.lng, coords.lat]}
                            zoom={14}
                            styles={{
                                light: currentStyle.url,
                                dark: currentStyle.url,
                            }}
                        >
                            <MapControls
                                showZoom
                                showLocate
                                showFullscreen
                                showCompass
                            />
                            {/* Layers Control */}
                            <div className="absolute top-2 left-2 z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-8 w-8 bg-background shadow-sm">
                                            <Layers className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((key) => (
                                            <DropdownMenuItem
                                                key={key}
                                                onClick={() => setSelectedLayer(key)}
                                                className={selectedLayer === key ? "bg-accent" : ""}
                                            >
                                                {MAP_STYLES[key].name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <MapMarker longitude={coords.lng} latitude={coords.lat}>
                                <MarkerContent>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                </MarkerContent>
                                <MarkerPopup className="text-sm">
                                    <div className="font-medium">Location</div>
                                    <div className="text-muted-foreground">{coords.address}</div>
                                </MarkerPopup>
                            </MapMarker>
                        </Map>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            {hasGoogleMapsKey
                                ? "Could not find location."
                                : "Google Maps API Key not configured."}
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground truncate max-w-[400px]" title={location}>
                        {location}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

