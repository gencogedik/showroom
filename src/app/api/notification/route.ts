import { NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
    try {
        // PayTR sends notification via form-urlencoded POST
        const formData = await req.formData();
        
        const merchant_oid = formData.get("merchant_oid") as string;
        const status = formData.get("status") as string;
        const total_amount = formData.get("total_amount") as string;
        const hash = formData.get("hash") as string;
        
        const merchant_key = (process.env.PAYTR_MERCHANT_KEY || "bR48pCDaEcXcu1Fq").trim();
        const merchant_salt = (process.env.PAYTR_MERCHANT_SALT || "N1qpznBY5wNbiipX").trim();

        // Generate hash to verify it came from PayTR
        const hash_str = merchant_oid + merchant_salt + status + total_amount;
        const expected_hash = crypto.createHmac("sha256", merchant_key).update(hash_str).digest("base64");

        if (hash !== expected_hash) {
            console.error("PAYTR NOTIFICATION ERROR: Hash mismatch!");
            return new NextResponse("PAYTR NOTIFICATION FAILED: HASH MISMATCH", { status: 400 });
        }

        if (status === "success") {
            // Payment successful
            console.log(`Order ${merchant_oid} SUCCESSFUL! Amount: ${total_amount}`);

            // 1. Fetch order details from Redis
            const orderStr = await redis.get(`order:${merchant_oid}`);
            if (orderStr) {
                const order = JSON.parse(orderStr);
                
                // 2. Prepare Kargonomi shipment payload
                const packages = order.items.map((item: any) => ({
                    content: `${item.quantity}x ${item.title}`,
                    desi: "1"
                }));

                const kargonomiPayload = {
                    shipment: {
                        sender_name: "Shuffle Case",
                        sender_email: "hello@shufflecase.com",
                        sender_tax_number: "32716823642", // Updated with user's TC
                        sender_tax_place: "Ümraniye",
                        sender_phone: "5555555555",
                        sender_address: "Elmalıkent, Adem Yavuz Cd. No17/A, 34764 Ümraniye/İstanbul",
                        sender_state_id: 34, // İstanbul
                        sender_city_id: 828, // Dummy/Ümraniye
                        reference_no: merchant_oid,
                        ecommerce_provider_order_no: merchant_oid,
                        buyer_name: order.buyer_name,
                        buyer_email: order.buyer_email || "",
                        buyer_phone: order.buyer_phone,
                        buyer_address: order.buyer_address,
                        buyer_state_id: parseInt(order.buyer_state_id),
                        buyer_city_id: parseInt(order.buyer_city_id),
                        packages: packages
                    }
                };

                // 3. Send to Kargonomi API
                const kargonomiToken = process.env.KARGONOMI_BEARER_TOKEN || "rDhWbb4GWLdQNtTTWPvHSLWNsLrIgTzb7iKU9elW2e39b486";

                if (kargonomiToken) {
                    try {
                        const kargonomiRes = await fetch("https://app.kargonomi.com.tr/api/v1/shipments", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${kargonomiToken}`
                            },
                            body: JSON.stringify(kargonomiPayload)
                        });

                        const kargonomiData = await kargonomiRes.json();
                        if (kargonomiRes.ok && kargonomiData.status === "success") {
                            console.log(`Kargonomi shipment created successfully for ${merchant_oid}! Tracking code: ${kargonomiData.data.tracking_code}`);
                        } else {
                            console.error(`Kargonomi API error for ${merchant_oid}:`, kargonomiData);
                        }
                    } catch (err) {
                        console.error(`Failed to send ${merchant_oid} to Kargonomi:`, err);
                    }
                } else {
                    console.warn(`Kargonomi credentials missing in .env! Order ${merchant_oid} not sent to Kargonomi.`);
                }
            } else {
                console.warn(`Order data for ${merchant_oid} not found in Redis! Expired or not created?`);
            }
        } else {
            // Payment failed
            const failed_reason_code = formData.get("failed_reason_code");
            const failed_reason_msg = formData.get("failed_reason_msg");
            console.error(`Order ${merchant_oid} FAILED! Reason: ${failed_reason_msg} (Code: ${failed_reason_code})`);
        }

        // PayTR expects exactly "OK" as a response body to stop sending notifications
        return new NextResponse("OK", { status: 200 });

    } catch (error: any) {
        console.error("PayTR Callback Error:", error);
        return new NextResponse("ERROR", { status: 500 });
    }
}
