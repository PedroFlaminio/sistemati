import $ from "jquery";
import { useEffect, useRef } from "react";
import "jquery-ui-sortable";

window.jQuery = $;
window.$ = $;

require("formBuilder");

const FormBuilder = (props) => {
  const fb = useRef();
  let x;
  var options = {
    disableFields: ["autocomplete", "button", "date", "file", "header", "hidden", "paragraph"],
    disabledActionButtons: ["data", "clear"],
    onCloseFieldEdit: function (evt, formData) {
      console.log(x());
      //props.setFormulario(x())
    },      
    onSave: function(evt, formData) {
      if (props.handleSave)
      props.handleSave(formData)
      //window.sessionStorage.setItem('formData', JSON.stringify(formData));
    },
    // onAddOption: function(evt, formData) {

    //   console.log(x())
    //   //console.log(x())
    //   //props.setFormulario(x())
    // }
  };

  useEffect(() => {
    $(fb.current)
      .formBuilder(options)
      .promise.then((formBuilder) => {
        console.log(props.form);
        formBuilder.actions.setData(props.form);
        formBuilder.actions.setLang("pt-BR");
        x = formBuilder.actions.getData;
      });
  }, []);
  return <div id="fb-editor" ref={fb} />;
};

export default FormBuilder;
