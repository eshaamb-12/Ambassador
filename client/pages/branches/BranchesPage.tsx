'use client';



import { useState } from 'react';

import HeroSection from '@/components/branches/HeroSection';

import BranchesAccentBand from '@/components/branches/BranchesAccentBand';

import BranchesGrid from '@/components/branches/BranchesGrid';

import BranchModal from '@/components/branches/BranchModal';

import BookVisitSection from '@/components/branches/BookVisitSection';

import StatsSection from '@/components/branches/StatsSection';

import SignupBanner from '@/components/common/signup-banner';

import { DEFAULT_BRANCHES_PAGE_CONFIG } from '@/lib/branchesPage.defaults';

import type { BranchesPageConfig, BranchesSectionId, ShowroomBranch } from '@/lib/branchesPage.types';



type BranchesPageProps = {

  config?: BranchesPageConfig;

};



const BranchesPage = ({ config: configProp }: BranchesPageProps) => {

  const config = configProp ?? DEFAULT_BRANCHES_PAGE_CONFIG;

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);



  const branches = config.branches;



  const handleGetDirections = (branch: ShowroomBranch) => {

    const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}`;

    window.open(url, '_blank');

  };



  const selectedBranchData = branches.find((branch) => branch.id === selectedBranch) ?? null;



  const renderSection = (id: BranchesSectionId) => {

    switch (id) {

      case 'hero':

        return <HeroSection content={config.hero} />;

      case 'accentBand':

        return <BranchesAccentBand content={config.accentBand} />;

      case 'grid':

        return (

          <BranchesGrid

            branches={branches}

            intro={config.gridIntro}

            onGetDirections={handleGetDirections}

            onViewDetails={setSelectedBranch}

          />

        );

      case 'stats':

        return <StatsSection content={config.stats} />;

      case 'bookVisit':

        return <BookVisitSection branches={branches} content={config.bookVisit} />;

      case 'signup':

        return <SignupBanner content={config.signup} />;

      default:

        return null;

    }

  };



  return (

    <div className="min-h-screen bg-white">

      {config.sections

        .filter((s) => s.enabled)

        .map((section) => (

          <div key={section.id}>{renderSection(section.id)}</div>
 
        ))}



      <BranchModal

        branch={selectedBranchData}

        onClose={() => setSelectedBranch(null)}

        onGetDirections={handleGetDirections}

      />

    </div>

  );

};



export default BranchesPage;

