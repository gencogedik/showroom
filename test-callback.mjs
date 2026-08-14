import crypto from "crypto";

async function testNotification() {
    const merchant_oid = "ORDER" + Date.now();
    const status = "success";
    const total_amount = "39900";
    const merchant_key = "bR48pCDaEcXcu1Fq";
    const merchant_salt = "N1qpznBY5wNbiipX";

    const hash_str = merchant_oid + merchant_salt + status + total_amount;
    const hash = crypto.createHmac("sha256", merchant_key).update(hash_str).digest("base64");

    const params = new URLSearchParams();
    params.append("merchant_oid", merchant_oid);
    params.append("status", status);
    params.append("total_amount", total_amount);
    params.append("hash", hash);

    try {
        const res = await fetch("https://shufflecase.com/api/notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });
        
        const text = await res.text();
        console.log("STATUS:", res.status);
        console.log("RESPONSE:", text);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testNotification();
