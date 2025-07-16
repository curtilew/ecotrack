'use client'

import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-mint-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 50%, #f0fdf4 100%)',
            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
        }}>
            {/* Subtle breathing animation background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Gentle floating orbs */}
                <div className="absolute w-32 h-32 bg-emerald-100 rounded-full opacity-20 animate-pulse" style={{
                    left: '5%', 
                    top: '10%', 
                    animationDuration: '6s',
                    filter: 'blur(20px)'
                }}></div>
                <div className="absolute w-24 h-24 bg-teal-100 rounded-full opacity-15 animate-pulse" style={{
                    right: '10%', 
                    top: '20%', 
                    animationDuration: '8s',
                    animationDelay: '2s',
                    filter: 'blur(15px)'
                }}></div>
                <div className="absolute w-40 h-40 bg-green-50 rounded-full opacity-10 animate-pulse" style={{
                    left: '70%', 
                    bottom: '15%', 
                    animationDuration: '10s',
                    animationDelay: '4s',
                    filter: 'blur(25px)'
                }}></div>
                
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Peaceful branding */}
                <div className="text-center mb-10" style={{
                    fontFamily: '"Inter", "SF Pro Text", -apple-system, system-ui, sans-serif',
                    fontWeight: '300'
                }}>
                    <div className="flex justify-center mb-6">
                        {/* <div className="w-24 h-24 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100/50" style={{
                            background: 'linear-gradient(135deg, #6ee7b7 0%, #14b8a6 100%)'
                        }}>
                            <span className="text-4xl drop-shadow-sm">🌱</span>
                        </div> */}
                    </div>
                    
                    <h1 className="text-5xl font-light bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 tracking-wide" style={{
                        fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
                        fontWeight: '200',
                        letterSpacing: '0.02em'
                    }}>
                        Join My Earth Ledger
                    </h1>
                    
                    <p className="text-gray-600 text-xl mb-3 font-light leading-relaxed" style={{
                        fontFamily: '"Inter", "SF Pro Text", system-ui, sans-serif',
                        fontWeight: '300'
                    }}>
                        Begin your journey to a greener tomorrow
                    </p>
                    
                    <p className="text-gray-500 text-base font-light tracking-wide" style={{
                        fontFamily: '"Inter", system-ui, sans-serif',
                        fontWeight: '200',
                        letterSpacing: '0.01em'
                    }}>
                        Small changes • Big impact • Better world
                    </p>
                </div>

                <SignUp 
                    fallbackRedirectUrl="/new-user"
                    appearance={{
                        elements: {
                            // Main card with soft, relaxing styling
                            card: "shadow-2xl border-0 rounded-3xl backdrop-blur-sm bg-white/80",
                            
                            // Header with relaxing typography
                            headerTitle: "text-2xl font-light text-gray-800 mb-3 tracking-wide",
                            headerSubtitle: "text-gray-600 text-base font-light leading-relaxed",
                            
                            // Primary button with gentle styling
                            formButtonPrimary: 
                                "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-light py-4 px-6 rounded-2xl shadow-lg shadow-emerald-100/50 transition-all duration-300 transform hover:scale-[1.01] focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 text-base tracking-wide",
                            
                            // Social buttons with soft appearance
                            socialButtonsBlockButton: 
                                "border border-gray-200 rounded-2xl hover:bg-gray-50/80 py-4 px-6 text-gray-700 font-light transition-all duration-300 shadow-sm backdrop-blur-sm",
                            socialButtonsBlockButtonText: "text-gray-700 font-light tracking-wide",
                            
                            // Form inputs with relaxing design
                            formFieldInput: 
                                "border border-gray-200 rounded-xl shadow-sm px-4 py-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 placeholder-gray-400 font-light backdrop-blur-sm bg-white/70",
                            formFieldLabel: "text-sm font-light text-gray-700 mb-2 tracking-wide",
                            
                            // Links with gentle styling
                            footerActionLink: "text-emerald-600 hover:text-emerald-500 font-light transition-colors duration-300 tracking-wide",
                            identityPreviewEditButton: "text-emerald-600 hover:text-emerald-500 font-light",
                            
                            // Error messages
                            formFieldErrorText: "text-red-500 text-sm mt-1 font-light",
                            
                            // Divider
                            dividerLine: "border-gray-200",
                            dividerText: "text-gray-500 text-sm font-light tracking-wide",
                            
                            // Form container
                            form: "space-y-8",
                            formFieldRow: "space-y-2",
                            
                            // Footer
                            footer: "mt-10",
                            footerAction: "text-center",
                            footerActionText: "text-gray-600 text-sm font-light tracking-wide",
                        },
                        layout: {
                            socialButtonsPlacement: "top",
                            showOptionalFields: true,
                        },
                        variables: {
                            colorPrimary: "#10b981",
                            colorSuccess: "#059669", 
                            colorWarning: "#f59e0b",
                            colorDanger: "#ef4444",
                            borderRadius: "1rem",
                            fontFamily: '"Inter", "SF Pro Text", -apple-system, system-ui, sans-serif',
                            fontSize: "1rem",
                            // @ts-expect-error: fontWeight is not a recognized variable in Clerk appearance config, but needed for custom font weight
                            fontWeight: "300"
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default SignUpPage;