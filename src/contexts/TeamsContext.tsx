import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team } from '@/types/team';

interface TeamsContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, 'id' | 'createdDate'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  getTeamById: (id: string) => Team | undefined;
  getTeamsByManager: (managerId: string) => Team[];
  getTeamsByMember: (memberId: string) => Team[];
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
};

const STORAGE_KEY = 'smoothire_teams';

const generateMockTeams = (): Team[] => {
  return [
    {
      id: '1',
      name: 'Engineering Team',
      department: 'Technology',
      managerIds: ['1'],
      memberIds: ['1', '2', '3', '4'],
      status: 'active',
      createdDate: '2024-01-15',
      kpis: {
        hires: 8,
        placements: 12,
        openings: 28,
        interviews: 45,
        revenue: 450000,
        feedbackScore: 4.6
      },
      description: 'Core engineering team responsible for product development and technical innovation.',
      targetKPIs: {
        hires: 10,
        placements: 15,
        openings: 35,
        interviews: 50,
        revenue: 500000,
        feedbackScore: 4.8
      }
    },
    {
      id: '2',
      name: 'Sales & Marketing',
      department: 'Sales',
      managerIds: ['5'],
      memberIds: ['5', '6', '7'],
      status: 'active',
      createdDate: '2024-02-01',
      kpis: {
        hires: 5,
        placements: 20,
        openings: 42,
        interviews: 60,
        revenue: 800000,
        feedbackScore: 4.4
      },
      description: 'Driving revenue growth through strategic sales and marketing initiatives.',
      targetKPIs: {
        hires: 6,
        placements: 25,
        openings: 50,
        interviews: 70,
        revenue: 900000,
        feedbackScore: 4.6
      }
    },
    {
      id: '3',
      name: 'Product Design',
      department: 'Design',
      managerIds: ['8'],
      memberIds: ['8', '9', '10'],
      status: 'active',
      createdDate: '2024-01-20',
      kpis: {
        hires: 3,
        placements: 8,
        openings: 18,
        interviews: 25,
        revenue: 320000,
        feedbackScore: 4.8
      },
      description: 'Creating exceptional user experiences through innovative design.',
      targetKPIs: {
        hires: 4,
        placements: 10,
        openings: 25,
        interviews: 30,
        revenue: 400000,
        feedbackScore: 4.9
      }
    }
  ];
};

export const TeamsProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const storedTeams = localStorage.getItem(STORAGE_KEY);
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      const mockTeams = generateMockTeams();
      setTeams(mockTeams);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTeams));
    }
  }, []);

  const saveTeams = (updatedTeams: Team[]) => {
    setTeams(updatedTeams);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTeams));
  };

  const addTeam = (teamData: Omit<Team, 'id' | 'createdDate'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    saveTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, teamData: Partial<Team>) => {
    const updatedTeams = teams.map(team =>
      team.id === id ? { ...team, ...teamData } : team
    );
    saveTeams(updatedTeams);
  };

  const deleteTeam = (id: string) => {
    const updatedTeams = teams.filter(team => team.id !== id);
    saveTeams(updatedTeams);
  };

  const getTeamById = (id: string) => {
    return teams.find(team => team.id === id);
  };

  const getTeamsByManager = (managerId: string) => {
    return teams.filter(team => team.managerIds.includes(managerId));
  };

  const getTeamsByMember = (memberId: string) => {
    return teams.filter(team => team.memberIds.includes(memberId));
  };

  return (
    <TeamsContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        getTeamById,
        getTeamsByManager,
        getTeamsByMember,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};
