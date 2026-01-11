import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface QuizAnswers {
  usage?: string;
  frequency?: string;
  problem?: string;
  goal?: string;
}

interface OnboardingContextType {
  answers: QuizAnswers;
  setAnswer: (key: keyof QuizAnswers, value: string) => void;
  resetQuiz: () => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const ONBOARDING_STORAGE_KEY = 'calc_onboarding_completed_v2';

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  });

  const setAnswer = (key: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const resetQuiz = () => {
    setAnswers({});
  };

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setHasCompletedOnboarding(true);
  };

  return (
    <OnboardingContext.Provider value={{ 
      answers, 
      setAnswer, 
      resetQuiz, 
      hasCompletedOnboarding, 
      completeOnboarding 
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
