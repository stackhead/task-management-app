// "use client"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import toast, { Toaster } from "react-hot-toast"
// import { FiMail, FiLoader } from "react-icons/fi"

// export default function ForgotPasswordPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       toast.error("Please enter your email");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

//       const response = await fetch("/auth/api/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("OTP sent! Check your email.");
//         setTimeout(() => {
//           router.push("/auth/otp");
//         }, 1000);
//       } else {
//         toast.error("Failed to send OTP. Try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
//       <Toaster position="top-right" />
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="p-6 sm:p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
//             <p className="text-gray-600 mt-2">Enter your email to receive an OTP</p>
//           </div>
//           <form onSubmit={handleForgotPassword} className="space-y-6">
//             <div className="space-y-2">
//               <label htmlFor="email" className="block text-md font-medium text-gray-900">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isLoading}
//                 required
//                 className="w-full px-3 py-2 border border-gray-900 rounded-md shadow-sm placeholder-gray-400 text-black"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full flex justify-center items-center py-2.5 px-4 text-white bg-gray-900 rounded-md shadow-sm"
//               disabled={isLoading}
//             >
//               {isLoading ? <FiLoader className="animate-spin h-4 w-4" /> : <FiMail className="w-4 h-4 mr-2" />}
//               Send OTP
//             </button>
//           </form>
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Remembered your password? <Link href="/auth/login" className="text-gray-900 hover:underline">Login</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
