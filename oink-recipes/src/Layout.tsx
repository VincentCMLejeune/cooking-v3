import type { ReactNode } from "react";
import { forwardRef } from "react";
import { 
  Layout as RALayout, 
  AppBar, 
  UserMenu, 
  useLogout,
  CheckForApplicationUpdate 
} from "react-admin";
import { MenuItem } from "@mui/material";
import ExitIcon from "@mui/icons-material/PowerSettingsNew";

// Logout button component following React Admin patterns
const MyLogoutButton = forwardRef<HTMLLIElement>((props, ref) => {
  const logout = useLogout();
  const handleClick = () => logout();
  
  return (
    <MenuItem
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      <ExitIcon /> Logout
    </MenuItem>
  );
});

// User menu component
const MyUserMenu = () => (
  <UserMenu>
    <MyLogoutButton />
  </UserMenu>
);

// App bar with user menu
const MyAppBar = () => <AppBar userMenu={<MyUserMenu />} />;

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout appBar={MyAppBar}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
