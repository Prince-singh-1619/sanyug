import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

const useNetworkSpeed = () => {
    const testSpeed = async() =>{
        try {
            const startTime = Date.now();
            const response = await fetch("/test-file.png?nocache=" + Math.random(), { //public/test-file.png
                cache: "no-store",
            });
            const endTime = Date.now();

            const blob = await response.blob();
            const size = blob.size;
            
            const duration = (endTime - startTime) / 1000; // seconds
            const speedKbps = (size / 1024) / duration; // KBps

            console.log("Internet speed:", speedKbps, "KB/s");

            if (speedKbps < 50) {
                // setToast({ type: "error", message: "Internet speed is very low" });
                toast.warn('Low internet connectivity.', {
                    style: {
                        border: "1px solid #FFA500",     // orange border
                        background: "#FFF4E5",           // light orange background
                        padding: "14px 18px",
                        color: "#663C00",                // dark warning text
                        borderRadius: "10px",
                        fontWeight: 500,
                        fontSize: "14px",
                    },
                    iconTheme: {
                        primary: "#FFA500",              // orange icon
                        secondary: "#FFF4E5",
                    },
                });
            }
        } catch (error) {
            console.error("Speed check failed:", error);
        }
    }

    useEffect(() => {
        // Run every 30 sec
        const interval = setInterval(testSpeed, 30000);
        // testSpeed(); // initial check

        return () => clearInterval(interval);
    }, []);
}

export default useNetworkSpeed