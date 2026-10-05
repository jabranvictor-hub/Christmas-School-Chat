export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isUrdu?: boolean;
  isStreaming?: boolean;
  error?: boolean;
}

export interface SchoolInfo {
  schoolName: string;
  host: string;
  principal: string;
  admin: string;
  teacher: string;
  students: string[];
  address: string;
  principalHouse: string;
  programTime: string;
}
