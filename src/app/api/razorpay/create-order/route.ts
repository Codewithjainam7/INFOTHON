import Razorpay from 'razorpay'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // Check for required environment variables
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        const keySecret = process.env.RAZORPAY_KEY_SECRET

        if (!keyId || !keySecret) {
            console.error('Razorpay credentials not configured')
            return NextResponse.json(
                { success: false, error: 'Payment gateway not configured. Please contact support.' },
                { status: 503 }
            )
        }

        // Initialize Razorpay inside the handler to avoid build-time errors
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        })

        const { amount, currency = 'INR', receipt } = await request.json()

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json({
            success: true,
            order,
        })
    } catch (error) {
        console.error('Razorpay order creation failed:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create order. Please try again.' },
            { status: 500 }
        )
    }
}
