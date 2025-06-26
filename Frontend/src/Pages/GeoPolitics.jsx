import React from 'react';
import { Globe } from 'lucide-react';
import Footer from '../Components/Footer';
import CategoryPage from './CategoryPage';

const GeoPolitics = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center">
            <Globe className="h-6 w-6 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-wide">Geo-Politics</h1>
            <p className="text-white/60 text-sm mt-1">Global political developments and analysis</p>
          </div>
        </div>
      </div>
      <CategoryPage category="geopolitics" title="Geo-Politics" />
      <Footer />
    </div>
  );
};

export default GeoPolitics;
