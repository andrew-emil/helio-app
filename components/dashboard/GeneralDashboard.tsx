import React from 'react';
import { Link } from 'react-router-dom';
import KpiCard from '../KpiCard';
import UserActivityChart from '../UserActivityChart';
import PropertyMap from '../PropertyMap';
import RecentActivityTable from '../RecentInquiriesTable';
import AlertsPanel from '../AlertsPanel';
import UsersToVerify from '../UsersToVerify';
import Footer from '../Footer';
import Spinner from '../Spinner';
import { UserIcon, MapIcon, WrenchScrewdriverIcon, ShieldExclamationIcon, HomeModernIcon, UserGroupIcon, BusIcon, NewspaperIcon, Bars3Icon } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';

const GeneralDashboard: React.FC = () => {
  const { data, loading, error, refetch } = useDashboardData();

  // Calculate KPI data - this must be called before any conditional returns
  const kpiData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    const { stats } = data;
    return [
      {
        title: "إجمالي الخدمات",
        value: stats.totalServices.toString(),
        change: `+${stats.recentServicesCount}`,
        changeLabel: "آخر 30 يوم",
        icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />,
        to: "/services-overview",
        changeType: 'positive' as const
      },
      {
        title: "إجمالي العقارات",
        value: stats.totalProperties.toString(),
        change: `+${stats.recentPropertiesCount}`,
        changeLabel: "آخر 30 يوم",
        icon: <HomeModernIcon className="w-8 h-8 text-amber-400" />,
        to: "/properties",
        changeType: 'positive' as const
      },
      {
        title: "إجمالي المستخدمين",
        value: stats.totalUsers.toString(),
        change: `+${stats.recentUsersCount}`,
        changeLabel: "آخر 30 يوم",
        icon: <UserGroupIcon className="w-8 h-8 text-lime-400" />,
        to: "/users",
        changeType: 'positive' as const
      },
      {
        title: "استخدام الباصات",
        value: `${stats.busTripsCount.toLocaleString()} رحلة`,
        change: "+150",
        changeLabel: "هذا الأسبوع",
        icon: <BusIcon className="w-8 h-8 text-purple-400" />,
        to: "/transportation",
        changeType: 'positive' as const
      },
      {
        title: "الأخبار والإشعارات",
        value: stats.totalNewsAndNotifications.toString(),
        change: `+${stats.recentNewsAndNotificationsCount}`,
        changeLabel: "آخر 30 يوم",
        icon: <NewspaperIcon className="w-8 h-8 text-indigo-400" />,
        to: "/news",
        changeType: 'positive' as const
      },
      {
        title: "بلاغات الطوارئ",
        value: `${stats.emergencyReportsCount} بلاغ`,
        change: "قبل 12 د",
        changeLabel: "آخر بلاغ",
        icon: <ShieldExclamationIcon className="w-8 h-8 text-rose-400" />,
        to: "/emergency",
        changeType: 'neutral' as const
      },
    ];
  }, [data]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            خطأ في تحميل البيانات
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {kpiData.map((kpi, index) => (
          <Link to={kpi.to} key={index} className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400 rounded-xl">
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              changeLabel={kpi.changeLabel}
              icon={kpi.icon}
              changeType={kpi.changeType}
            />
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left/Center column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><UserIcon className="w-6 h-6 mr-2" /> نمو المستخدمين الشهري</h3>
            <UserActivityChart />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><Bars3Icon className="w-6 h-6 mr-2" /> أحدث الأنشطة</h3>
            <RecentActivityTable />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GeneralDashboard;
