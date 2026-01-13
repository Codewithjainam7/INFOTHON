import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

        // Create a temporary response to hold cookies
        let redirectUrl = `${origin}/profile`
        const tempResponse = NextResponse.next()

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            tempResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // Exchange the code for a session
        const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

        // Check if user has completed their profile (has college info)
        if (session?.user) {
            const userMetadata = session.user.user_metadata
            if (!userMetadata?.college) {
                // New user - redirect to onboarding
                redirectUrl = `${origin}/onboarding`
            }
        }

        // Create final response with redirect
        const response = NextResponse.redirect(redirectUrl)

        // Copy cookies from temp response
        tempResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value)
        })

        return response
    }

    // If no code, redirect to login
    return NextResponse.redirect(`${origin}/login`)
}
