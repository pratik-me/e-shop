"use client"

import { useEffect, useState } from "react";

const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_DAYS = 20;

const getStoredLocation = () => {
    const [location, setLocation] = useState<any | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (storedData) {
          setLocation(JSON.parse(storedData));
        }
      }, []);

    if(location === null) return null;
    const expiryTime = LOCATION_EXPIRY_DAYS * 24  * 60 * 60 * 1000;   // Converting number to days
    const isExpired = Date.now() - location.timeStamp > expiryTime;

    return isExpired ? null : location;
}

const useLocationTracking = () => {
    const [location, setLocation] = useState<{country: string, city: string; timestamp: number} | null>(getStoredLocation());

    useEffect(() => {
        if(location) return;
        fetch("http://ip-api.com/json/").then(res => res.json()).then(data => {
            const newLocation = {
                country: data?.country as string,
                city: data?.city as string,
                timestamp: Date.now(),
            };
            localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation))
            setLocation(newLocation);
        }).catch(error => console.log("Failed to get location", error))
    })

    return location;
}

export default useLocationTracking;