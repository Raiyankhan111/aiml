import Header from '../components/Header';
import ISSTracker from '../components/ISSTracker';
import NewsSection from '../components/NewsSection';
import AIChatbot from '../chatbot/AIChatbot';

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (ISS Map & Charts) */}
          <div className="lg:col-span-2 space-y-8">
            <ISSTracker />
          </div>

          {/* Sidebar Area (News Feed) */}
          <div className="lg:col-span-1 space-y-8">
            <NewsSection />
          </div>

        </div>
      </main>

      <AIChatbot />
    </div>
  );
}
