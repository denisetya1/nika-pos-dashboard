import ToastContextProvider from "../context/toast/ToastContextProvider";
import { HomePageContent } from "./content";

export default function HomePage() {
  return (
    
    <ToastContextProvider>
      <HomePageContent />
    </ToastContextProvider>
  )
}
