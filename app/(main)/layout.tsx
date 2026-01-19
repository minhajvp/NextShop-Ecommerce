

import Navbar from "@/components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
            <CartProvider>
                <div>
        <Navbar/>
          
        <div>
{children}
        </div>
    </div>

            </CartProvider>
            </AuthProvider>
    
    
       
            
          
        
        
       

        

        
     
  );
}
