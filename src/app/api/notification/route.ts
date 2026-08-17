import { NextResponse } from "next/server";
import crypto from "crypto";

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
            // Note: Kargonomi shipment creation is now handled client-side on the /success page
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
