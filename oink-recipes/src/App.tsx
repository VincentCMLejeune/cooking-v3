import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { firestoreDataProvider } from "./dataProvider";
import { RecipeList, RecipeCreate, RecipeEdit } from "./resources/Recipe";

export const App = () => (
  <Admin 
    dataProvider={firestoreDataProvider}
    layout={Layout}
    dashboard={RecipeList}
  >
    <Resource 
      name="recipes" 
      list={RecipeList}
      create={RecipeCreate}
      edit={RecipeEdit}
    />
  </Admin>
);
