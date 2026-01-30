
export type Language = 
  | 'English' | 'Hindi' | 'Bengali' | 'Tamil' | 'Telugu' | 'Marathi' 
  | 'Urdu' | 'Gujarati' | 'Kannada' | 'Odia' | 'Malayalam' | 'Punjabi' 
  | 'Assamese' | 'Kashmiri' | 'Konkani' | 'Manipuri' | 'Nepali' | 'Bodo' 
  | 'Dogri' | 'Maithili' | 'Santali' | 'Sindhi' | 'Sanskrit';

export interface User {
  id: string;
  name: string;
  role: 'Worker' | 'Employer' | 'Verifier';
  isVerified: boolean;
  walletAddress?: string;
  aadhaarLast4?: string;
  avatar?: string;
}

export interface Skill {
  id: string;
  userId: string;
  title: string;
  category: string;
  issuer: string;
  issueDate: string;
  ipfsHash: string;
  txHash: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  verifiedBy?: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  category: string;
  postedBy: string;
  requiredSkills: string[];
  matchScore?: number;
}

export interface TranslationDict {
  [key: string]: {
    [lang in Language]?: string;
  };
}
