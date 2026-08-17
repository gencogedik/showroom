import { NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // --- PAYTR AYARLARI ---
        // Bu bilgileri PayTR Mağaza Paneli -> Bilgi sayfasından alıp .env.local dosyasına ekleyin.
        const merchant_id = (process.env.PAYTR_MERCHANT_ID || "TEST_MERCHANT_ID").trim();
        const merchant_key = (process.env.PAYTR_MERCHANT_KEY || "TEST_MERCHANT_KEY").trim();
        const merchant_salt = (process.env.PAYTR_MERCHANT_SALT || "TEST_MERCHANT_SALT").trim();
        
        // Müşterinin sepet tutarı (PayTR kuruş olarak ister, yani 100.50 TL = 10050)
        const payment_amount = Math.round(body.total * 100);
        const merchant_oid = "ORDER" + Date.now(); // PayTR alfanümerik ister, tire (-) kullanılamaz
        const email = body.user.email;
        const user_name = body.user.name;
        const user_address = body.user.address + " " + body.user.city;
        const user_phone = body.user.phone;
        const user_ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        
        // Dinamik URL Tespiti (Vercel veya Localhost için otomatik ayarlar)
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host") || "localhost:3000";
        const baseUrl = `${protocol}://${host}`;

        const merchant_ok_url = `${baseUrl}/success?order_id=${merchant_oid}&email=${encodeURIComponent(email)}`; // Başarılı dönüş URL
        const merchant_fail_url = `${baseUrl}/checkout?error=paytr_failed`; // Hata dönüş URL
        
        // Sepetteki ürünleri PayTR'nin istediği formata dönüştür
        // Format: [['Ürün Adı', Fiyat, Adet], ['Ürün Adı 2', Fiyat 2, Adet 2]]
        const user_basket_encoded = Buffer.from(
            JSON.stringify(body.items.map((i: any) => [`${i.title} (${i.model})`, i.price.toString(), i.quantity]))
        ).toString("base64");
        
        const timeout_limit = "30";
        const currency = "TL";
        const test_mode = "1"; // Canlı mod için 0, Test modu için 1

        // Güvenlik Hash (Token) Oluşturma
        const hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket_encoded + "0" + "0" + currency + test_mode;
        const paytr_token = hash_str + merchant_salt;
        const token = crypto.createHmac("sha256", merchant_key).update(paytr_token).digest("base64");

        // Sipariş detaylarını Kargonomi için Redis'e kaydet (1 saat geçerli)
        const orderData = {
            buyer_name: user_name,
            buyer_email: email,
            buyer_phone: user_phone,
            buyer_address: body.user.address,
            buyer_state_id: body.user.city, // Kargonomi İl ID'si
            buyer_city_id: body.user.district || body.user.city, // Dummy/ID
            items: body.items,
            amount: payment_amount
        };
        try {
            await redis.set(`order:${merchant_oid}`, JSON.stringify(orderData), 'EX', 3600);
        } catch (redisErr) {
            console.error("Redis Hatası (Kargonomi Entegrasyonu için gerekli):", redisErr);
            // We do NOT throw here so the PayTR checkout can still proceed even if Redis is broken.
        }

        // --- GERÇEK PAYTR İSTEĞİ ---
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
        paytrParams.append('test_mode', test_mode);

        const paytrResponse = await fetch("https://www.paytr.com/odeme/api/get-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: paytrParams.toString()
        });

        const result = await paytrResponse.json();
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("PayTR Error:", error);
        return NextResponse.json({ status: "error", reason: error.message }, { status: 500 });
    }
}
