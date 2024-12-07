import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Панель управления',
    url: '/dashboard/',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Проверка',
    url: '/check',
    icon: 'exploit',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Сервисы',
    url: '/services',
    icon: 'website',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
];

interface Question {
  question_title: string;
  answer: string;
}

interface FormData {
  id: number;
  candidate: string;
  status: string;
  questions: Question[];
  cv: string;
}

export const formsData: FormData[] = [
  {
    id: 1,
    candidate: "Berdyshev Kerey",
    status: "Complete",
    questions: [
      {
        question_title: "What is your name",
        answer: "Berdyshev Kerey"
      }
    ],
    cv: "document"
  },
  {
    id: 2,
    candidate: "Baglanov Alikhan",
    status: "In-progress",
    questions: [
      {
        question_title: "What is your name",
        answer: "Baglanov Alikhan"
      }
    ],
    cv: "document"
  },
  {
    id: 3,
    candidate: "Mazhitov Jafar",
    status: "Pending",
    questions: [
      {
        question_title: "What is your name",
        answer: ""
      }
    ],
    cv: "document"
  }
];

interface ClassInfo {
  id: number;
  class_liter: string;
  classNumber: String;
  curator: string;
}

interface subjectInfo {
  id: number;
  classNumber: String;
  subjects: string[];
}

export const classData: ClassInfo[] = [
  { id: 1, class_liter: "9A", classNumber: "9", curator: "Татьяна Викторовна" },
  { id: 2, class_liter: "9B", classNumber: "9", curator: "Ирина Сергеевна" },
  { id: 3, class_liter: "9C", classNumber: "9", curator: "Ольга Викторовна" },
  { id: 4, class_liter: "9D", classNumber: "9", curator: "Светлана Николаевна" },
  { id: 5, class_liter: "9E", classNumber: "9", curator: "Наталья Борисовна" },
  { id: 6, class_liter: "9F", classNumber: "9", curator: "Марина Александровна" }
];

export const subjectData: subjectInfo[] = [
  { id: 1, classNumber: "9", subjects: ["Казахский язык и литература", "Русская литература", "Русский язык", "Математика", "Физическая культура", "Искусство", "История Казахстана", "Химия", "Английский язык","Физика", "Биология", "Всемирная история", "География", "Основы права", "Информатика"]},
];

export interface Service {
  id: number;
  ipAddress: string;
  domain: string;
  vulnerability: {
    potential: number;
    real: number;
    total: number;
  }
  status: string;
  lastUpdated: string;
}