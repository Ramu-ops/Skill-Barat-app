
import React, { useState, useEffect, useCallback } from 'react';
import { User, Skill, Gig, Language } from './types';
import { UI_STRINGS, LANGUAGES } from './i18n';
import { getSkillMatchScores, translateContent } from './geminiService';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Onboarding from './components/Onboarding';
import Header from './components/Header';

const MOCK_USER: User = {
  id: 'u1',
  name: 'Rahul Joshi',
  role: 'Worker',
  isVerified: false,
  avatar: 'https://picsum.photos/seed/rahul/200'
};

const MOCK_SKILLS: Skill[] = [
  {
    id: 's1',
    userId: 'u1',
    title: 'Certified Electrician',
    category: 'Electrical',
    issuer: 'NSDC India',
    issueDate: '2023-05-15',
    ipfsHash: 'QmXoyp...32h1',
    txHash: '0x45a...f21b',
    status: 'Verified',
    verifiedBy: 'Sagar Sharma'
  }
];

const MOCK_GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Solar Panel Installation',
    description: 'Require expert for 5kW rooftop installation in Jaipur rural area.',
    location: 'Jaipur, Rajasthan',
    pay: '₹2,500/day',
    category: 'Solar',
    postedBy: 'Surya Shakti Ltd',
    requiredSkills: ['Electrician', 'Solar Panel Installation']
  },
  {
    id: 'g2',
    title: 'Wiring for New Construction',
    description: 'Full house wiring project. 10 rooms. Material provided.',
    location: 'Gurgaon, Haryana',
    pay: '₹15,000 Total',
    category: 'Electrical',
    postedBy: 'BuildRight Contractors',
    requiredSkills: ['Electrician', 'Blueprint Reading']
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('English');
  const [activeTab, setActiveTab] = useState('profile');
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [showKYC, setShowKYC] = useState(false);

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.['English'] || key;

  const handleOnboardingComplete = (userData: User) => {
    setUser(userData);
  };

  const addSkill = (newSkill: Skill) => {
    setSkills(prev => [newSkill, ...prev]);
  };

  const updateGigScores = useCallback(async () => {
    if (user && skills.length > 0) {
      const scoredGigs = await getSkillMatchScores(skills, gigs);
      setGigs(scoredGigs);
    }
  }, [user, skills, gigs]);

  useEffect(() => {
    if (user) {
      updateGigScores();
    }
  }, [user, skills.length]);

  if (!user) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
        language={language} 
        setLanguage={setLanguage} 
        t={t}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 text-slate-900">
      <Header 
        user={user} 
        language={language} 
        setLanguage={setLanguage} 
        t={t} 
      />
      
      <main className="max-w-md mx-auto px-4 pt-6">
        <Dashboard 
          activeTab={activeTab} 
          user={user} 
          skills={skills} 
          gigs={gigs} 
          t={t} 
          addSkill={addSkill}
          language={language}
        />
      </main>

      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        t={t} 
        userRole={user.role}
      />
    </div>
  );
};

export default App;
