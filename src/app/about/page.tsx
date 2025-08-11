import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | PipeGallery',
  description: 'Learn about PipeGallery - our mission, location, contact information, and visiting hours.',
  keywords: ['about gallery', 'gallery information', 'contact', 'visiting hours', 'location'],
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About PipeGallery
          </h1>
          <p className="text-lg text-gray-600">
            Learn more about our gallery, mission, and how to visit us
          </p>
        </header>
        
        <div className="space-y-8">
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              PipeGallery is dedicated to showcasing contemporary art and supporting emerging artists. 
              Our mission is to create a space where art and community intersect.
            </p>
          </section>
          
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Visit Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
                <p className="text-gray-600">
                  Tuesday - Sunday: 10:00 AM - 6:00 PM<br />
                  Monday: Closed
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <p className="text-gray-600">
                  Email: info@pipegallery.com<br />
                  Phone: +82-2-XXXX-XXXX
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Location
            </h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-600">
                Gallery location and map will be available soon.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}