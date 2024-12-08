'use client';
import { useEffect, useState } from "react";
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
import axiosInstance from "@/app/axios/instance";

const downloadPDF = (data: any) => {
  if (!data) {
    console.error("No user data available to generate PDF.");
    return; // Prevent PDF generation if data is not available
  }

  const doc = new jsPDF();

  // Use the standard font
  doc.setFont("helvetica", "bold"); 

  doc.setFontSize(18);
  doc.text('Report on User Data and Services', 10, 10);

  doc.setFont("helvetica", "normal"); 
  doc.setFontSize(10);

  // User data section
  const info = data['User Info'].user;
  doc.text(`Email: ${info.email}`, 10, 20);
  doc.text(`Updated at ${new Date(info.createdAt).toLocaleString()}`, 10, 30);

  // Services data section
  const services = info.services;
  const servicesTableData = services.map(service => [
    service.id, service.ip, service.domain, new Date(service.createdAt).toLocaleString()
  ]);

  const head = ["Service ID", "IP Address", "Domain", "Created At"];
  autoTable(doc, {
    head: [head],
    body: servicesTableData,
    startY: 40, // Table position
  });

  // Save PDF
  const today = new Date();
  const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  doc.save('User-Report-' + formattedDate + '.pdf');
};

export default function DashBoardPage() {
  const [vulnerabilityCount, setVulnerabilityCount] = useState({
    allVulnCount: 0,
    potentialVulnCount: 0,
    realVulnCount: 0,
    noVulnCount: 0,
});
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get('/user/vulnerabilities/count');
        setVulnerabilityCount(response.data); // Предполагается, что API возвращает массив данных
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get('/user/me');
        setUserInfo(response.data); // Предполагается, что API возвращает массив данных
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }

    fetchData();
  }, []);

  const reportData = {
    'Total Vulnerabilities': vulnerabilityCount.potentialVulnCount + vulnerabilityCount.realVulnCount,
    'Potential Vulnerabilities': vulnerabilityCount.potentialVulnCount,
    'Real Vulnerabilities': vulnerabilityCount.realVulnCount,
    'No Vulnerabilities': vulnerabilityCount.noVulnCount,
    'Total Services': userInfo?.user?.services?.length || 0,
    'User Info': userInfo ? userInfo : 'Not Available',
    // Add any other data you want to include in the report
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Добро пожаловать, {"Kerey"}!
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button className='bg-[#5754de]' onClick={() => downloadPDF(reportData)}>Скачать</Button>
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
                <div className="text-2xl font-bold group-hover:text-red-500 transition duration-300">{vulnerabilityCount.potentialVulnCount + vulnerabilityCount.realVulnCount}</div>
                <p className="text-xs text-muted-foreground group-hover:text-red-500 transition duration-300">
                  +{vulnerabilityCount.potentialVulnCount + vulnerabilityCount.realVulnCount} с прошлой недели
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
                  <div className="text-2xl font-bold">{vulnerabilityCount.potentialVulnCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +{vulnerabilityCount.potentialVulnCount} с прошлой недели
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-orange-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-orange-500 transition duration-300">
                  <CardTitle className="text-sm font-medium group-hover:text-orange-500 transition duration-300">Серьезные уязвимости</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-octagon-alert"><path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/></svg>
                </CardHeader>
                <CardContent className='group-hover:text-orange-500 transition duration-300'>
                  <div className="text-2xl font-bold">{vulnerabilityCount.realVulnCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +{vulnerabilityCount.realVulnCount} с прошлой недели
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
                  <div className="text-2xl font-bold">{vulnerabilityCount.noVulnCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +{vulnerabilityCount.noVulnCount ? 0 : 0} с прошлой недели
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
                  <CardTitle>Сервисы с уязвимостями</CardTitle>
                  <CardDescription>
                    Всего сервисов: {userInfo?.user?.services?.length || 0}
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
