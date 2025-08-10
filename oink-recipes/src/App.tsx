import { Admin } from "react-admin";
import { Layout } from "./Layout";
import { firestoreDataProvider } from "./dataProvider";

export const App = () => (
  <Admin 
    dataProvider={firestoreDataProvider}
    layout={Layout}
  >
    {/* Resources will be added here later */}
  </Admin>
);
