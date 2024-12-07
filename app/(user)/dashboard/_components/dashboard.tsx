'use client';

import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {ExploitTable} from './exploits-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const downloadPDF = () => {
  const doc = new jsPDF();

  // Use the standard font
  doc.setFont("helvetica");

  // Title
  doc.setFontSize(18);
  doc.text('Report on Data for December 2024', 10, 10);

  // Report description
  doc.setFontSize(12);
  doc.text('This is an example report with data on revenue, subscriptions, and sales.', 10, 20);

  // Data for the table
  const head = ["Parameter", "Value"];
  const data = [
    ["Total Revenue", "$45,231.89"],
    ["Subscriptions", "2350"],
    ["Sales", "12,234"],
    ["Active Users", "573"],
    ["Average Revenue per User", "$19.85"]
  ];

  // Generate table
  autoTable(doc, {
    head: [head],
    body: data,
    startY: 30, // Table position
  });

  const today = new Date();
  const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  doc.save('Report-' + formattedDate + '.pdf');
};


export default function DashBoardPage() {

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Добро пожаловать, {"Kerey"}!
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button className='bg-[#5754de]' onClick={downloadPDF}>Скачать</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
            
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Card className="hover:border-red-500 group transition duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-red-500 transition duration-300">
                  Всего уязвимостей
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-triangle-alert group-hover:text-red-500 transition duration-300"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                  <path d="M12 9v4"/>
                  <path d="M12 17h.01"/>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-red-500 transition duration-300">$45,231.89</div>
                <p className="text-xs text-muted-foreground group-hover:text-red-500 transition duration-300">
                  +20% с прошлой недели
                </p>
              </CardContent>
            </Card>

              <Card className="hover:border-yellow-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-yellow-500 transition duration-300">
                  <CardTitle className="text-sm font-medium group-hover:text-yellow-500 transition duration-300">
                    Потенциальные уязвимости
                  </CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </CardHeader>
                <CardContent className='group-hover:text-yellow-500 transition duration-300'>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +15% с прошлой недели
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-orange-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-orange-500 transition duration-300">
                  <CardTitle className="text-sm font-medium group-hover:text-orange-500 transition duration-300">Серьезные уязвимости</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-octagon-alert"><path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/></svg>
                </CardHeader>
                <CardContent className='group-hover:text-orange-500 transition duration-300'>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +20% с прошлой недели
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-green-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-green-500 transition duration-300">
                  <CardTitle className="text-sm font-medium">
                    Без уязвимостей
                  </CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                </CardHeader>
                <CardContent className='group-hover:text-green-500 transition duration-300'>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    -20% с прошлой недели
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-8 w-full">
                <BarGraph />
              </div>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Эксплоиты с уязвимостями</CardTitle>
                  <CardDescription>
                    Всего эксплоитов: 10
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExploitTable />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
