import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testPayTR() {
    try {
        const merchant_id = process.env.PAYTR_MERCHANT_ID;
        const merchant_key = process.env.PAYTR_MERCHANT_KEY;
        const merchant_salt = process.env.PAYTR_MERCHANT_SALT;
        
        console.log("Keys loaded:", { merchant_id, key_length: merchant_key?.length, salt_length: merchant_salt?.length });

        const payment_amount = 39900;
        const merchant_oid = "ORDER-" + Date.now();
        const email = "test@test.com";
        const user_ip = "85.105.105.105"; // Normal Turkish IP
        
        const user_basket = [["TEST", "399", 1]];
        const user_basket_encoded = Buffer.from(JSON.stringify(user_basket)).toString("base64");
        
        const hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket_encoded + "0" + "0" + "TL" + "1";
        const paytr_token = hash_str + merchant_salt;
        const token = crypto.createHmac("sha256", merchant_key).update(paytr_token).digest("base64");

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
        paytrParams.append('user_name', "Test Name");
        paytrParams.append('user_address', "Test Address");
        paytrParams.append('user_phone', "05555555555");
        paytrParams.append('merchant_ok_url', "https://www.shufflecase.com/shop");
        paytrParams.append('merchant_fail_url', "https://www.shufflecase.com/checkout");
        paytrParams.append('timeout_limit', '30');
        paytrParams.append('currency', 'TL');
        paytrParams.append('test_mode', '1');

        const paytrResponse = await fetch("https://www.paytr.com/odeme/api/get-token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: paytrParams.toString()
        });

        const result = await paytrResponse.json();
        console.log("PAYTR RESULT:", result);

    } catch (error) {
        console.error(error);
    }
}

testPayTR();
