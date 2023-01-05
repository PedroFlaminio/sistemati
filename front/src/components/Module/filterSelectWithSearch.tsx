import Select, { SingleValue } from "react-select";
import { ModuleItem } from "./context";

type FilterSelectWithSearchProps = {
  label: string;
  options: ModuleItem[];
  value: ModuleItem|null;
  onChange?: ((newValue: SingleValue<ModuleItem>) => void) | undefined;
  size?: number
  divClassNameAdd?: string;
}

export const FilterSelectWithSearch = (props: FilterSelectWithSearchProps) => {
  const { options, label, value,size = 250, divClassNameAdd = "" } = props;
  const handleValue = (newValue: SingleValue<ModuleItem>) => {
    if (props.onChange)
      props.onChange(newValue)    
  }
  return (
    <div className={"d-flex flex-row me-2 g-0 " + divClassNameAdd}>
      <label className="dropdown-header text-primary p-1">
        <strong>{label}</strong>
      </label>
      <div className="col">
        <Select
          //{...SelectHTMLAttributes}
          options={options}
          value={value}
          className={"form-select-sm z-500"}
          placeholder="Selecione"
          onChange={handleValue}
          //menuPlacement="top"
          menuPortalTarget={document.body} 
          styles={{
            control: (base, state) => ({
              ...base,
              height: "28px",
              minHeight: "28px",
              alignItems: "flex-start",
              boxShadow: "#1b3573",
              borderColor: state.isFocused ? "#1b3573" : "#CCC",
              "&:hover": {
                borderColor: "#1b3573",
              },
            }),
            input: (base) => ({
              ...base,
              paddingBottom: 10,
              marginBottom: 0,
              height: "28px",
              minHeight: "28px",
              alignItems: "flex-start",
            }),
            menu: (base) => ({ ...base, marginTop: 0 }),
            container: (base) => ({ ...base, paddingTop: 0, paddingBottom: 0, width: size }),
            indicatorsContainer: (base) => ({ ...base, padding: 0, paddingBottom: 8 }),
            indicatorSeparator: (base) => ({ ...base, backgroundColor: "#FFF" }),
            dropdownIndicator: (base) => ({ ...base, padding: 8, paddingBottom: 4, paddingTop: 4, color: "#666" }),
            placeholder: (base) => ({ ...base, paddingBottom: 8 }),
            singleValue: (base) => ({ ...base, paddingBottom: 8 }),
            menuList:  (base) => ({ ...base, zIndex: 100}),
          }}
        />
      </div>
    </div>
  );
};

export default FilterSelectWithSearch;
