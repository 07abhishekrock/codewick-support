import { useFormik } from "formik";
import { useContext, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { LoadingContext } from "../utils/contexts";

const EditorWithUpdate = ({updateFunction , deleteFunction , note_obj , btnText })=>{
    const editor_ref = useRef(null);
    const html_editor_ref = useRef(null);
    const editor_form = useFormik({
        initialValues : {
            ...note_obj
        },
        onSubmit : async (values)=>{
            await updateFunction(values);   
            editor_form.setFieldValue('notes','');
        },
        validate:()=>{
            let errors = {};
            if(editor_ref.current){
                if(html_editor_ref.current.getText().trim().length === 0){
                    errors.notes = 'Empty Notes are not allowed';
                }
                else{
                    editor_form.setFieldError('notes',undefined);
                }
            }
            return errors;
        }
    });
    useEffect(()=>{
        html_editor_ref.current = editor_ref.current.makeUnprivilegedEditor(editor_ref.current.getEditor());
    },[])
    return(
        <form className="editor-with-update" onSubmit={(e)=>{
            e.preventDefault();
            editor_form.submitForm();
        }}>
            <ReactQuill ref={editor_ref} value={editor_form.values.notes} onChange = {(new_html_value)=>{
                editor_form.setFieldValue('notes' , new_html_value);
            }}/>
            <div className="btn-group">
            {editor_form.errors.notes ? <i className="error">{editor_form.errors.notes}</i>
            :<button className="update-btn">{btnText || 'Update'}</button>}
            <button className="update-btn" onClick={(e)=>{
                e.preventDefault();
                console.log(editor_form.values);
                deleteFunction(editor_form.values._id);
            }}>Delete</button>
            </div>
        </form>
    )
}

export default EditorWithUpdate;