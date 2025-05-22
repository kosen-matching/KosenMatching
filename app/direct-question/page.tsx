import Header from "@/components/header"
import Footer from "@/components/Footer"
import DirectQuestionSection from "@/components/landing/DirectQuestionSection"

export default function DirectQuestionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <DirectQuestionSection />
      </main>
      <Footer />
    </div>
  )
} 