import React from 'react';
import { Trophy } from 'lucide-react';
import Footer from '../Components/Footer';
import CategoryPage from './CategoryPage';

const Sports = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-wide">Sports</h1>
            <p className="text-white/60 text-sm mt-1">Latest sports news and updates</p>
          </div>
        </div>
      </div>
      <CategoryPage category="sports" title="Sports" />
      <Footer />
    </div>
  );
};

export default Sports;
