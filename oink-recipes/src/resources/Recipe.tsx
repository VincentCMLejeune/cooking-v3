import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  ShowButton,
  Create,
  Edit,
  Show,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  minValue,
  SimpleShowLayout,
  ArrayField,
  SingleFieldList,
  ChipField,
  BooleanField,
  BooleanInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  TextArrayInput,
  FunctionField,
} from 'react-admin';

// Recipe List Component
export const RecipeList = () => (
  <List 
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <NumberField source="basePersonsIngredients" label="Servings" />
      <BooleanField source="isVegetarian" label="Vegetarian" />
      <BooleanField source="isQuick" label="Quick" />
      <BooleanField source="isCheatMeal" label="Cheat Meal" />
      <BooleanField source="isTuppable" label="Tuppable" />
      <EditButton />
    </Datagrid>
  </List>
);

// Recipe Create Component
export const RecipeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <NumberInput 
        source="basePersonsIngredients" 
        label="Servings"
        validate={[required(), minValue(1)]}
      />
      <BooleanInput source="isVegetarian" label="Vegetarian" />
      <BooleanInput source="isQuick" label="Quick Recipe" />
      <BooleanInput source="isCheatMeal" label="Cheat Meal" />
      <BooleanInput source="isTuppable" label="Tuppable" />
      
      <ArrayInput source="ingredients">
        <SimpleFormIterator>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <NumberInput source="quantity" label="Quantity" />
            <TextInput source="unit" label="Unit" />
            <TextInput source="ingredient" label="Ingredient" validate={required()} />
          </div>
        </SimpleFormIterator>
      </ArrayInput>
      
      <ArrayInput source="recipe" label="Recipe Steps">
        <SimpleFormIterator>
          <TextInput source="step" multiline rows={2} validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);

// Recipe Edit Component
export const RecipeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <NumberInput 
        source="basePersonsIngredients" 
        label="Servings"
        validate={[required(), minValue(1)]}
      />
      <BooleanInput source="isVegetarian" label="Vegetarian" />
      <BooleanInput source="isQuick" label="Quick Recipe" />
      <BooleanInput source="isCheatMeal" label="Cheat Meal" />
      <BooleanInput source="isTuppable" label="Tuppable" />
      
      <ArrayInput source="ingredients">
        <SimpleFormIterator>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <NumberInput source="quantity" label="Quantity" />
            <TextInput source="unit" label="Unit" />
            <TextInput source="ingredient" label="Ingredient" validate={required()} />
          </div>
        </SimpleFormIterator>
      </ArrayInput>
      
      <ArrayInput source="recipe" label="Recipe Steps">
        <SimpleFormIterator>
          <TextInput source="step" multiline rows={2} validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// Recipe Show Component
export const RecipeShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" />
      <NumberField source="basePersonsIngredients" label="Servings" />
      <BooleanField source="isVegetarian" label="Vegetarian" />
      <BooleanField source="isQuick" label="Quick Recipe" />
      <BooleanField source="isCheatMeal" label="Cheat Meal" />
      <BooleanField source="isTuppable" label="Tuppable" />
      
      <ArrayField source="ingredients">
        <Datagrid>
          <NumberField source="quantity" label="Quantity" />
          <TextField source="unit" label="Unit" />
          <TextField source="ingredient" label="Ingredient" />
        </Datagrid>
      </ArrayField>
      
      <ArrayField source="recipe">
        <Datagrid>
          <NumberField source="index" label="#" />
          <TextField source="step" />
        </Datagrid>
      </ArrayField>
      
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
