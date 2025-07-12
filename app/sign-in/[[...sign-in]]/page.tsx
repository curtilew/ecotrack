'use client'

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Inspiring Subtle Background Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Floating particles representing positive impact */}
                <div className="absolute w-2 h-2 bg-emerald-200 rounded-full opacity-30 animate-float-slow" style={{left: '10%', top: '20%', animationDelay: '0s'}}></div>
                <div className="absolute w-1 h-1 bg-teal-200 rounded-full opacity-40 animate-float-medium" style={{left: '80%', top: '30%', animationDelay: '2s'}}></div>
                <div className="absolute w-3 h-3 bg-emerald-100 rounded-full opacity-25 animate-float-slow" style={{left: '70%', top: '70%', animationDelay: '4s'}}></div>
                <div className="absolute w-1 h-1 bg-green-200 rounded-full opacity-35 animate-float-fast" style={{left: '20%', top: '80%', animationDelay: '1s'}}></div>
                <div className="absolute w-2 h-2 bg-teal-100 rounded-full opacity-30 animate-float-medium" style={{left: '90%', top: '15%', animationDelay: '3s'}}></div>
                
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>

            {/* CSS for floating animation */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px); 
                        opacity: 0.2; 
                    }
                    50% { 
                        transform: translateY(-20px) translateX(10px); 
                        opacity: 0.4; 
                    }
                }
                
                @keyframes float-medium {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px); 
                        opacity: 0.3; 
                    }
                    50% { 
                        transform: translateY(-15px) translateX(-8px); 
                        opacity: 0.5; 
                    }
                }
                
                @keyframes float-fast {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px); 
                        opacity: 0.25; 
                    }
                    50% { 
                        transform: translateY(-10px) translateX(15px); 
                        opacity: 0.45; 
                    }
                }
                
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                
                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                }
                
                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
            `}</style>
            <div className="max-w-md w-full">
                {/* Optional: Add your logo/branding above the form */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        {/* <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-3xl">🌍</span>
                        </div> */}
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                        EcoTrack
                    </h1>
                    <p className="text-gray-600 text-lg mb-2">
                        Every small step creates lasting change
                    </p>
                    <p className="text-gray-500 text-sm">
                        Track. Reduce. Impact.
                    </p>
                </div>

                <SignIn 
                    appearance={{
                        elements: {
                            // Main card styling
                            card: "shadow-2xl border-0 rounded-3xl backdrop-blur-sm bg-white/80",
                            
                            // Header styling
                            headerTitle: "text-2xl font-bold text-gray-900 mb-2",
                            headerSubtitle: "text-gray-600 text-base",
                            
                            // Primary button (Sign In button)
                            formButtonPrimary: 
                                "bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-sm normal-case",
                            
                            // Social buttons (Google, etc.)
                            socialButtonsBlockButton: 
                                "border border-gray-300 rounded-lg hover:bg-gray-50 py-3 px-4 text-gray-700 font-medium transition-colors duration-200 shadow-sm",
                            socialButtonsBlockButtonText: "text-gray-700 font-medium",
                            
                            // Form inputs
                            formFieldInput: 
                                "border border-gray-300 rounded-lg shadow-sm px-3 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 placeholder-gray-400",
                            formFieldLabel: "text-sm font-medium text-gray-700 mb-2",
                            
                            // Links
                            footerActionLink: "text-emerald-600 hover:text-emerald-500 font-medium transition-colors duration-200",
                            identityPreviewEditButton: "text-emerald-600 hover:text-emerald-500",
                            
                            // Error messages
                            formFieldErrorText: "text-red-600 text-sm mt-1",
                            
                            // Divider
                            dividerLine: "border-gray-300",
                            dividerText: "text-gray-500 text-sm",
                            
                            // Form container
                            form: "space-y-6",
                            formFieldRow: "space-y-1",
                            
                            // Footer
                            footer: "mt-8",
                            footerAction: "text-center",
                            footerActionText: "text-gray-600 text-sm",
                        },
                        layout: {
                            // Show social buttons at the top
                            socialButtonsPlacement: "top",
                            // Show divider between social and form
                            showOptionalFields: true,
                        },
                        variables: {
                            // Color scheme
                            colorPrimary: "#059669", // emerald-600
                            colorSuccess: "#10b981", // emerald-500
                            colorWarning: "#f59e0b", // amber-500
                            colorDanger: "#ef4444",  // red-500
                            
                            // Border radius
                            borderRadius: "0.5rem", // 8px
                            
                            // Font
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontSize: "0.875rem", // 14px
                        }
                    }}
                    redirectUrl="/dashboard"
                    // Optional: customize sign-up link
                    signUpUrl="/sign-up"
                />
            </div>
        </div>
    );
};

export default SignInPage;