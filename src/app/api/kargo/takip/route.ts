import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, email } = body;

        if (!orderId || !email) {
            return NextResponse.json(
                { error: 'Sipariş numarası ve e-posta zorunludur.' },
                { status: 400 }
            );
        }

        const bearerToken = process.env.KARGONOMI_BEARER_TOKEN || "rDhWbb4GWLdQNtTTWPvHSLWNsLrIgTzb7iKU9elW2e39b486";

        // If credentials are not set (which they now are by default), return mock data for development purposes.
        if (!bearerToken) {
            console.log("Kargonomi API anahtarları bulunamadı. Sahte (Mock) veri dönülüyor.");
            
            // Artificial delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));

            return NextResponse.json({
                success: true,
                data: {
                    id: 1,
                    type: "shipment",
                    shipping_webservice_tracking_code: "91234567890",
                    shipping_provider_name: "Yurtiçi Kargo",
                    status: "shipped", // draft, preparing, shipped, delivered
                    status_label: "Kargoya Verildi",
                    ecommerce_provider_order_no: orderId,
                    buyer_name: "Test Müşteri",
                    buyer_email: email,
                    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    updated_at: new Date().toISOString()
                },
                isMock: true
            });
        }

        // Real Kargonomi API Integration
        // Since we want a specific order, we could filter it locally if no search param exists, 
        // or rely on Kargonomi's search param if documented. Assuming it lists all for now and we find ours.
        const response = await fetch('https://app.kargonomi.com.tr/api/v1/shipments', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        if (!response.ok) {
            console.error("Kargonomi API Hatası:", await response.text());
            return NextResponse.json(
                { error: 'Kargo sistemine bağlanılamadı. Lütfen daha sonra tekrar deneyin.' },
                { status: 502 }
            );
        }

        const data = await response.json();
        const shipments = data.data || [];

        // Find the specific shipment matching the order number AND the exact email
        const targetShipment = shipments.find((s: any) => 
            (s.ecommerce_provider_order_no === orderId || s.reference_no === orderId) && 
            s.buyer_email?.toLowerCase() === email.toLowerCase()
        );

        if (!targetShipment) {
            return NextResponse.json(
                { error: 'Bu sipariş numarasına ait kargo kaydı bulunamadı.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: targetShipment,
            isMock: false
        });

    } catch (error: any) {
        console.error("Takip API Hatası:", error);
        return NextResponse.json(
            { error: 'Bilinmeyen bir hata oluştu.' },
            { status: 500 }
        );
    }
}
