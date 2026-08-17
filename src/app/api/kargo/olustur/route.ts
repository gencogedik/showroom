import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Basic validation for required fields according to Kargonomi API
        const { 
            buyer_name, 
            buyer_email,
            buyer_phone, 
            buyer_address, 
            buyer_district,
            buyer_state_id, 
            buyer_city_id, 
            reference_no,
            packages 
        } = body;

        if (!buyer_name || !buyer_email || !buyer_phone || !buyer_address || !buyer_state_id || !buyer_city_id || !packages || packages.length === 0) {
            return NextResponse.json(
                { error: 'Lütfen tüm zorunlu teslimat bilgilerini (E-posta dâhil) eksiksiz doldurun.' },
                { status: 400 }
            );
        }

        const bearerToken = process.env.KARGONOMI_BEARER_TOKEN || "rDhWbb4GWLdQNtTTWPvHSLWNsLrIgTzb7iKU9elW2e39b486";

        // Construct the shipment payload
        // We assume we don't have a warehouse_id, so we must provide sender info.
        // For production, the user would either set warehouse_id OR fill the sender details below.
        const shipmentPayload = {
            shipment: {
                sender_name: "Shuffle Case",
                sender_email: "hello@shufflecase.com",
                sender_tax_number: "32716823642",
                sender_tax_place: "Ümraniye",
                sender_phone: "5555555555",
                sender_address: "Elmalıkent, Adem Yavuz Cd. No17/A, 34764 Ümraniye/İstanbul",
                sender_state_id: 34, // İstanbul
                sender_city_id: 828, // TODO: Ümraniye'nin gerçek Kargonomi ID'si ile değiştirilecek (Şifreler gelince)
                reference_no: reference_no || `ORD-${Date.now()}`,
                ecommerce_provider_order_no: reference_no || `ORD-${Date.now()}`,
                buyer_name,
                buyer_email,
                buyer_phone: buyer_phone.replace(/[^0-9]/g, "").slice(-10),
                buyer_address: `${buyer_district || buyer_city_id} - ${buyer_address}`,
                buyer_state_id: parseInt(buyer_state_id) || 34,
                buyer_city_id: 1, // Dummy ID
                packages: packages.map((pkg: any) => ({
                    content: pkg.content || "Telefon Kılıfı",
                    desi: pkg.desi || "1"
                }))
            }
        };

        // If credentials are not set (which they now are by default), return mock.
        if (!bearerToken) {
            console.log("Kargonomi API anahtarları bulunamadı. Kargo başarıyla oluşturuldu (Mock) kabul ediliyor.");
            
            // Artificial delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            return NextResponse.json({
                success: true,
                message: "Siparişiniz başarıyla alındı ve kargo kaydı (MOCK) oluşturuldu.",
                data: {
                    id: Math.floor(Math.random() * 10000) + 1000,
                    status: "draft",
                    status_label: "Taslak"
                },
                isMock: true
            });
        }

        // Real Kargonomi API Integration
        const response = await fetch('https://app.kargonomi.com.tr/api/v1/shipments', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify(shipmentPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Kargonomi API Gönderi Hatası:", data);
            return NextResponse.json(
                { error: data.message || 'Kargo sistemiyle iletişim kurulamadı.' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            data: data,
            isMock: false
        });

    } catch (error: any) {
        console.error("Oluşturma API Hatası:", error);
        return NextResponse.json(
            { error: 'Bilinmeyen bir sunucu hatası oluştu.' },
            { status: 500 }
        );
    }
}
