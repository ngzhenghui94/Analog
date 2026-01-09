"use client";

import * as React from "react";
import { importLibrary } from "@googlemaps/js-api-loader";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Map, MapMarker, MarkerPopup } from "@/components/ui/map";
import { env } from "@repo/env/client";

interface LocationMapPreviewDialogProps {
    location: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const hasGoogleMapsKey = Boolean(env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

export function LocationMapPreviewDialog({
    location,
    open,
    onOpenChange,
}: LocationMapPreviewDialogProps) {
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Location Preview</DialogTitle>
                </DialogHeader>
                <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
                    {isLoading ? (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            Loading map...
                        </div>
                    ) : coords ? (
                        <Map
                            center={[coords.lng, coords.lat]}
                            zoom={14}
                        >
                            <MapMarker longitude={coords.lng} latitude={coords.lat}>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                                    <MapPin className="h-5 w-5" />
                                </div>
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
                <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={location}>
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
