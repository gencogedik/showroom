import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // --- PAYTR AYARLARI ---
        // Bu bilgileri PayTR Mağaza Paneli -> Bilgi sayfasından alıp .env.local dosyasına ekleyin.
        const merchant_id = process.env.PAYTR_MERCHANT_ID || "TEST_MERCHANT_ID";
        const merchant_key = process.env.PAYTR_MERCHANT_KEY || "TEST_MERCHANT_KEY";
        const merchant_salt = process.env.PAYTR_MERCHANT_SALT || "TEST_MERCHANT_SALT";
        
        // Müşterinin sepet tutarı (PayTR kuruş olarak ister, yani 100.50 TL = 10050)
        const payment_amount = Math.round(body.total * 100);
        const merchant_oid = "ORDER-" + Date.now();
        const email = body.user.email;
        const user_name = body.user.name;
        const user_address = body.user.address + " " + body.user.city;
        const user_phone = body.user.phone;
        const user_ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const merchant_ok_url = "http://localhost:3000/shop"; // Başarılı dönüş URL
        const merchant_fail_url = "http://localhost:3000/checkout"; // Hata dönüş URL
        
        // Sepetteki ürünleri PayTR'nin istediği formata dönüştür
        // Her ürün için: [ "Ürün Adı", "Fiyat", "Adet" ]
        const user_basket = body.items.map((item: any) => [item.title, item.price.toString(), item.quantity]);
        const user_basket_encoded = Buffer.from(JSON.stringify(user_basket)).toString("base64");
        
        // Güvenlik Hash (Token) Oluşturma
        const hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket_encoded + "0" + "0" + "0" + "0";
        const paytr_token = hash_str + merchant_salt;
        const token = crypto.createHmac("sha256", merchant_key).update(paytr_token).digest("base64");

        // --- TEST MODU MOCK CEVAP ---
        // Eğer gerçek API key yoksa, sistemi test etmek için sahte (mock) bir token dönüyoruz.
        if (merchant_id === "TEST_MERCHANT_ID") {
            // Simulated delay
            await new Promise(r => setTimeout(r, 1500));
            return NextResponse.json({
                status: "success",
                token: "MOCK_PAYTR_TOKEN_" + merchant_oid,
                message: "Test modunda sahte token oluşturuldu."
            });
        }

        // --- GERÇEK PAYTR İSTEĞİ ---
        /*
        const paytrParams = new URLSearchParams();
        paytrParams.append('merchant_id', merchant_id);
        paytrParams.append('user_ip', user_ip);
        paytrParams.append('merchant_oid', merchant_oid);
        paytrParams.append('email', email);
        paytrParams.append('payment_amount', payment_amount.toString());
        paytrParams.append('paytr_token', token);
        paytrParams.append('user_basket', user_basket_encoded);
        paytrParams.append('debug_on', '1');
        paytrParams.append('no_installment', '0');
        paytrParams.append('max_installment', '0');
        paytrParams.append('user_name', user_name);
        paytrParams.append('user_address', user_address);
        paytrParams.append('user_phone', user_phone);
        paytrParams.append('merchant_ok_url', merchant_ok_url);
        paytrParams.append('merchant_fail_url', merchant_fail_url);
        paytrParams.append('timeout_limit', '30');
        paytrParams.append('currency', 'TL');
        paytrParams.append('test_mode', '1');

        const paytrResponse = await fetch("https://www.paytr.com/odeme/api/get-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: paytrParams.toString()
        });

        const result = await paytrResponse.json();
        return NextResponse.json(result);
        */
        
        // Fallback for when keys are provided but request logic is commented above
        return NextResponse.json({
            status: "error",
            reason: "Gerçek PayTR isteği API dosyasında yorum satırında bekliyor. Aktif etmek için api/paytr/route.ts içindeki yorumu kaldırın."
        });

    } catch (error: any) {
        console.error("PayTR Error:", error);
        return NextResponse.json({ status: "error", reason: error.message }, { status: 500 });
    }
}
