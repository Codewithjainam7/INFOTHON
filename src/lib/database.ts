import { createClient } from '@/lib/supabase'

// Type definitions
export interface EventRegistration {
    id?: string
    user_id: string
    event_id: string
    event_name: string
    price: number
    payment_status: 'pending' | 'completed' | 'failed'
    payment_id?: string
    registered_at?: string
}

// Register for events (save to database)
export async function registerForEvents(
    userId: string,
    events: { id: string; title: string; price: number }[]
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()

    const registrations = events.map(event => ({
        user_id: userId,
        event_id: event.id,
        event_name: event.title,
        price: event.price,
        payment_status: 'pending' as const
    }))

    const { error } = await supabase
        .from('event_registrations')
        .insert(registrations)

    if (error) {
        console.error('Registration error:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

// Get user's registered events
export async function getUserRegistrations(userId: string): Promise<EventRegistration[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', userId)
        .order('registered_at', { ascending: false })

    if (error) {
        console.error('Fetch registrations error:', error)
        return []
    }

    return data || []
}

// Update payment status
export async function updatePaymentStatus(
    registrationId: string,
    status: 'completed' | 'failed',
    paymentId?: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()

    const { error } = await supabase
        .from('event_registrations')
        .update({
            payment_status: status,
            payment_id: paymentId
        })
        .eq('id', registrationId)

    if (error) {
        console.error('Update payment error:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

// Get user profile
export async function getUserProfile(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Fetch profile error:', error)
        return null
    }

    return data
}

// Update user profile
export async function updateUserProfile(
    userId: string,
    updates: { full_name?: string; phone?: string; college?: string; avatar_url?: string }
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)

    if (error) {
        console.error('Update profile error:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}
