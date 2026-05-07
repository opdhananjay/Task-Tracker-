import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  ClipboardList,
  Bug,
  BarChart3,
  Users,
  Building,
  User,
  SquareFunction  
} from "lucide-react";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/* ===================== MENUS ===================== */

export const menus = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['Developer', 'TeamLeader', 'Manager', 'Tester']
  },

  {
    name: 'Tasks',
    icon: ClipboardList,
    roles: ['TeamLeader', 'Manager'],
    children: [
      { name: 'All Tasks', path: '/tasks/all', roles: ['TeamLeader','Manager'] },
      { name: 'Create Task', path: '/tasks/create', roles: ['TeamLeader', 'Manager'] }
    ]
  },

  {
    name: 'Development',
    icon: SquareFunction,
    roles: ['Developer'],
    children: [
      {
        name: 'My Tasks',
        path: '/development/mytasks',
        roles: ['Developer']
      },
      {
        name: 'Unit Testing',
        path: '/development/unittesting',
        roles: ['Developer']
      }
    ]
  },

  {
    name: 'Testing',
    icon: Bug,
    roles: ['Tester', 'Manager'],
    children: [
      {
        name: 'Testing Queue',
        path: '/testing/queue',
        roles: ['Tester']
      },
      {
        name: 'Review Tasks',
        path: '/testing/review',
        roles: ['Tester']
      }
    ]
  },

  {
    name: 'Reports',
    icon: BarChart3,
    roles: ['TeamLeader', 'Manager', 'Developer', 'Tester'],
    children: [
      { name: 'Developer Performance', path: '/reports/developer', roles: ['TeamLeader', 'Manager'] },
      { name: 'Testing Reports', path: '/reports/testing', roles: ['Manager'] }
    ]
  },

  {
    name: 'Users',
    path: '/users',
    icon: Users,
    roles: ['Manager'],
    children:[
      { name:'Create User', path:'/users/create',roles:['Manager'] },
      { name:'Users List', path:'/users/list',roles:['Manager'] },
    ]
  },

  {
    name: 'Organization',
    path: '/organization',
    icon: Building,
    roles: ['Manager'],
    children: [
      { name:'Organization Settings', path: '/organization/settings' ,roles: ['Manager'] }
    ]
  },

  {
    name: 'Profile',
    path: '/profile',
    icon: User,
    roles: ['Developer', 'TeamLeader', 'Manager', 'Tester']
  }
];

/* ===================== SIDEBAR ===================== */

const Sidebar = ({ isOpen, role = "Developer" }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  /* Filter menus by role */
  const filteredMenus = menus
    .filter(menu => menu.roles.includes(role))
    .map(menu => ({
      ...menu,
      children: menu.children
        ? menu.children.filter(child => child.roles.includes(role))
        : null
    }));

  return (
    <div
      className={`fixed left-0 w-64 h-full z-50 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="flex flex-col gap-2 p-2">

        {menus.map((item, index) => {
          const Icon = item.icon;
          const isParentOpen = openMenu === index;

          return (
            <div key={index}>

              {/* ===== SINGLE MENU ===== */}
              {!item.children ? (
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded ${
                    location.pathname === item.path
                      ? "bg-gray-300"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  {item.name}
                </Link>
              ) : (
                <>
                  {/* ===== PARENT MENU ===== */}
                  <div
                    className="cursor-pointer p-2 rounded flex justify-between items-center hover:bg-gray-200"
                    onClick={() =>
                      setOpenMenu(isParentOpen ? null : index)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon size={18} />}
                      {item.name}
                    </div>

                    {isParentOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>

                  {/* ===== SUB MENU ===== */}
                  {isParentOpen && (
                    <ul className="ml-6 mt-1 flex flex-col gap-1">
                      {item.children.map((sub, i) => (
                        <li key={i}>
                          <Link
                            to={sub.path}
                            className={`block p-2 text-sm rounded ${
                              location.pathname === sub.path
                                ? "bg-gray-300"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

            </div>
          );
        })}

      </nav>
    </div>
  );
};

export default Sidebar;