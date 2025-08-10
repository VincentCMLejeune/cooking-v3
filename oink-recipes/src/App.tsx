import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { firestoreDataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { LoginPage } from "./LoginPage";
import { RecipeList, RecipeCreate, RecipeEdit } from "./resources/Recipe";

export const App = () => (
  <Admin 
    dataProvider={firestoreDataProvider}
    authProvider={authProvider}
    loginPage={LoginPage}
    layout={Layout}
  >
    <Resource 
      name="recipes" 
      list={RecipeList}
      create={RecipeCreate}
      edit={RecipeEdit}
    />
  </Admin>
);
